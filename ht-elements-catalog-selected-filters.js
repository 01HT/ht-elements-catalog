"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/lib/repeat.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon";
import "@01ht/ht-chip";
import {
  getPathFromParameters,
  getParametersFromPath
} from "./ht-elements-catalog-path-parser.js";
class HTElementsCatalogSelectedFilters extends LitElement {
  _render({ params, items, number }) {
    return html`
      <style>
        :host {
            display: block;
            position:relative;
            box-sizing:border-box;
        }

        a {
            display:block;
            color:inherit;
            text-decoration: none;
        }

        #container {
            display:flex;
            flex-wrap: wrap;
            align-items:center;
            min-height:32px;
            font-size:13px;
        }

        #container > * {
            margin-right: 8px;
            margin-bottom: 8px;
        }

        #all-items {
            color: var(--secondary-text-color);
        }

        #number {
            font-weight:600;
        }

        #categories {
            display:flex;
            align-items:center;
            flex-wrap:wrap;
        }

        #categories a {
            text-decoration: underline;
        }

        .categories-separator {
            margin: 0 4px;
        }

        #reset {
            margin-left:8px;
            text-decoration: underline;
            line-height:32px;
            height:32px;
        }

        #categories[hidden], #reset[hidden] {
          display:none;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-elements-catalog-selected-filters">
          <svg>
              <defs>
                <g id="sort"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></g> </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div id="all-items">Всего элементов: <span id="number">${number}</span></div>
        <div id="categories" hidden?=${
          this._showCategories(params) ? false : true
        }></div>
        ${repeat(
          items,
          item =>
            html`<a class="item" href=${item.href}> 
              <ht-chip label=${item.name} close shadow icon?=${
              item.type === "sort" ? true : false
            }>
                ${
                  item.type === "sort"
                    ? html`<div slot="avatar">
                  <iron-icon icon="ht-elements-catalog-selected-filters:sort"></iron-icon>
                </div>`
                    : ""
                }
              </ht-chip>
            </a>`
        )}
        <a id="reset" href="/catalog" hidden?=${
          this._showClearAll(params) ? false : true
        }>Очистить все</a>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-selected-filters";
  }

  static get properties() {
    return {
      params: Object,
      items: Array,
      number: Number
    };
  }

  constructor() {
    super();
    this.params = {};
    this.items = [];
    this.number = 0;
  }

  ready() {
    super.ready();
    this.shadowRoot.addEventListener("close-chip", e => {
      e.stopPropagation();
    });
  }

  set data(data) {
    this.number = data;
  }

  set parameters(parameters) {
    if (Object.keys(parameters).length === 0) {
      this.params = {};
      this.items = [];
      return;
    }
    this.params = parameters;
    this.updateItems();
  }

  _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async updateItems() {
    let items = [];
    let parameters = JSON.parse(JSON.stringify(this.params));
    // categories
    if (parameters.categories) {
      // add Все категории
      let categoriesHTML = "";
      let newParameters = JSON.parse(JSON.stringify(parameters));
      delete newParameters["categories"];
      let href = await getPathFromParameters(newParameters);
      categoriesHTML += `<a href="${href}">Все категории</a>`;
      // add other categories
      let categories = parameters.categories.split("/");
      let categoriesLength = categories.length;
      for (let index in categories) {
        let name = this._capitalizeFirstLetter(categories[index]);
        categoriesHTML += `<div class="categories-separator">/</div>`;
        if (+index === categoriesLength - 1) {
          categoriesHTML += `<div>${name}</div>`;
        } else {
          let newParameters = JSON.parse(JSON.stringify(parameters));
          newParameters["categories"] = name.toLowerCase();
          let href = await getPathFromParameters(newParameters);
          categoriesHTML += `<a href="${href}">${name}</a>`;
        }
      }
      this.shadowRoot.querySelector("#categories").innerHTML = categoriesHTML;
    }
    // items
    for (let name in parameters) {
      if (name !== "search" && name !== "categories") {
        // tags
        if (name === "tags" || name === "browsers" || name === "tools") {
          let tags = parameters[name];
          for (let tag of tags) {
            const newParameters = JSON.parse(JSON.stringify(parameters));
            let index = newParameters[name].indexOf(tag);
            newParameters[name].splice(index, 1);
            let href = await getPathFromParameters(newParameters);
            let item = {
              name: tag,
              href: href
            };
            items.push(item);
          }
        }
        // sort
        if (name === "sort") {
          let newParameters = JSON.parse(JSON.stringify(parameters));
          let name = parameters["sort"];
          switch (name) {
            case "sales": {
              name = "сортировать по: продажам";
              break;
            }
            case "price-asc": {
              name = "сортировать по: цене | от низкой";
              break;
            }
            case "price-desc": {
              name = "сортировать по: цене | от высокой";
              break;
            }
          }
          delete newParameters["sort"];
          let href = await getPathFromParameters(newParameters);
          let item = {
            name: name,
            href: href,
            type: "sort"
          };
          items.push(item);
        }
        // platform
        if (name === "platform") {
          let newParameters = JSON.parse(JSON.stringify(parameters));
          delete newParameters["platform"];
          let name = parameters["platform"];
          let href = await getPathFromParameters(newParameters);
          let item = {
            name: name,
            href: href
          };
          items.push(item);
        }
      }
    }
    this.items = items;
  }

  _showCategories(params) {
    if (params.categories === undefined) return false;
    return true;
  }

  _showClearAll(params) {
    if (Object.keys(params).length === 0) return false;
    return true;
  }
}

customElements.define(
  HTElementsCatalogSelectedFilters.is,
  HTElementsCatalogSelectedFilters
);
