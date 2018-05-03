"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/lib/repeat.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon";
import {
  getPathFromParameters,
  getParametersFromPath
} from "./ht-elements-catalog-path-parser.js";
class HTElementsCatalogSelectedFilters extends LitElement {
  render({ params, items, number }) {
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

        .item {
            max-width: 250px;
            //background: #e0dfe1;
            background:#fff;
            font-size:13px;
            border-radius: 32px;
            height:32px;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            position: relative;
            padding-left: 12px;
            align-items: center;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .item iron-icon {
            color:rgba(0,0,0,.54);
            width: 20px;
            height: 20px;
            min-width:20px;
            min-height: 20px;
            padding: 0 8px;
            //color:var(--secondary-text-color);
        }

        .item:hover {
            background: rgba(0,0,0,.54);
            color:#fff;
        }

        .item:hover iron-icon {
            color:#fff;
        }

        .item .name {
          color:rgba(0,0,0,.87);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .item:hover .name {
            color:#fff;
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
               <g id="cancel"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></g>
              </defs>
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
            html`<a class="item" href=${item.href}><div class="name">${
              item.name
            }</div><iron-icon icon="ht-elements-catalog-selected-filters:cancel"></iron-icon></a>`
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
        if (name === "tags") {
          let tags = parameters["tags"];
          for (let tag of tags) {
            const newParameters = JSON.parse(JSON.stringify(parameters));
            let index = newParameters.tags.indexOf(tag);
            newParameters.tags.splice(index, 1);
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
            href: href
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
