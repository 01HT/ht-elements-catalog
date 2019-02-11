"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon";
import "@01ht/ht-chip";
import { getPathFromParameters } from "./ht-elements-catalog-path-parser.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogSelectedFilters extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        a {
          display: block;
          color: inherit;
          text-decoration: none;
          outline: none;
          text-decoration: none;
        }

        #container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          min-height: 32px;
          font-size: 13px;
        }

        #container > * {
          margin-right: 8px;
          margin-bottom: 8px;
        }

        #all-items {
          color: var(--secondary-text-color);
        }

        #number {
          font-weight: 600;
        }

        #categories {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        #categories a {
          text-decoration: underline;
        }

        .categories-separator {
          margin: 0 4px;
        }

        #reset {
          margin-left: 8px;
          text-decoration: underline;
          line-height: 32px;
          height: 32px;
        }

        #categories[hidden],
        #reset[hidden] {
          display: none;
        }
      `
    ];
  }

  render() {
    const { params, items, number } = this;
    return html`
      <iron-iconset-svg size="24" name="ht-elements-catalog-selected-filters">
          <svg>
              <defs>
                <g id="sort"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></g> </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div id="all-items">Всего элементов: <span id="number">${number}</span></div>
        <div id="categories" ?hidden="${!this._showCategories(params)}"></div>
        ${repeat(
          items,
          item => html`<a class="item" href="${item.href}"> 
              <ht-chip .label="${item.name}" close shadow image="${
            item.imageURL
          }" ?icon="${item.type === "sort"}">
                ${
                  item.type === "sort"
                    ? html`<div slot="avatar">
                  <iron-icon icon="ht-elements-catalog-selected-filters:sort"></iron-icon>
                </div>`
                    : ""
                }
                ${
                  item.imageURL
                    ? html`<div slot="avatar">
                  <iron-icon src="${item.imageURL}"></iron-icon>
                </div>`
                    : ``
                }
              </ht-chip>
            </a>`
        )}
        <a id="reset" href="/catalog" ?hidden="${!this._showClearAll(
          params
        )}">Очистить все</a>
      </div>
`;
  }

  static get properties() {
    return {
      params: { type: Object },
      items: { type: Array },
      number: { type: Number },
      parameters: { type: Object }
    };
  }

  constructor() {
    super();
    this.params = {};
    this.items = [];
    this.number = 0;
    this.filterData = {};
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("close-chip", e => {
      e.stopPropagation();
    });
  }

  set data(data) {
    this.number = data.count;
    this.filterData = data.filter;
    this.updateItems();
  }

  set parameters(parameters) {
    parameters = JSON.parse(parameters);
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
    if (Object.keys(this.filterData).length === 0) return;
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
            let imageURL = null;
            for (let index in this.filterData[name]) {
              let item = this.filterData[name][index];
              if (item.name.toLowerCase() === tag.toLowerCase()) {
                imageURL = item.imageURL;
              }
            }
            let item = {
              name: tag,
              href: href,
              imageURL: imageURL
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
          let imageURL = null;
          for (let index in this.filterData["platform"]) {
            let item = this.filterData["platform"][index];
            if (item.name.toLowerCase() === name.toLowerCase()) {
              imageURL = item.imageURL;
            }
          }
          let item = {
            name: name,
            href: href,
            imageURL: imageURL
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
  "ht-elements-catalog-selected-filters",
  HTElementsCatalogSelectedFilters
);
