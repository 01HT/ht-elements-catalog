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

        #reset {
          margin-left: 8px;
          text-decoration: underline;
          line-height: 32px;
          height: 32px;
        }
      `
    ];
  }

  render() {
    const { items, quantity } = this;
    return html`
      <iron-iconset-svg size="24" name="ht-elements-catalog-selected-filters">
          <svg>
              <defs>
                <g id="sort"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></g> </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div id="all-items">Всего элементов: <span id="number">${quantity}</span></div>
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
        ${
          items.length !== 0
            ? html`<a id="reset" href="/catalog">Очистить все</a>`
            : null
        }
      </div>
`;
  }

  static get properties() {
    return {
      items: { type: Array },
      data: { type: Object },
      parameters: { type: Object },
      quantity: { type: Number }
    };
  }

  constructor() {
    super();
    this.items = [];
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("close-chip", e => {
      e.stopPropagation();
    });
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("parameters") || changedProperties.has("data")) {
      this.updateItems();
    }
    return true;
  }

  _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async updateItems() {
    if (!this.data || !this.parameters) return;
    for (let prop in this.parameters) {
      if (
        (!this.data.filter || !this.data.filter[prop]) &&
        (prop !== "sort" && prop !== "search")
      ) {
        return;
      }
    }
    let items = [];
    let parameters = JSON.parse(JSON.stringify(this.parameters));
    let data = JSON.parse(JSON.stringify(this.data));

    // search
    if (parameters["search"]) {
      let newParameters = JSON.parse(JSON.stringify(parameters));
      let name = parameters["search"];
      delete newParameters["search"];
      let href = await getPathFromParameters(newParameters);
      let item = {
        name: `"${name}"`,
        href: href
      };
      items.push(item);
    }
    // categories & attributes
    for (let name in parameters) {
      let values = parameters[name];
      for (let value of values) {
        if (name !== "search" && name !== "sort") {
          const newParameters = JSON.parse(JSON.stringify(parameters));
          let index = newParameters[name].indexOf(value);
          if (
            name === "categories" ||
            name === "direction" ||
            name === "platform"
          ) {
            newParameters[name].splice(index);
          }
          if (
            name === "languages" ||
            name === "tools" ||
            name === "browsers" ||
            name === "tags"
          ) {
            newParameters[name].splice(index, 1);
          }
          let href = await getPathFromParameters(newParameters);
          let imageURL = null;
          let itemName = "";

          for (let index in data.filter[name]) {
            let item = data.filter[name][index];
            if (item.name.toLowerCase() === value.toLowerCase()) {
              itemName = item.name;
              imageURL = item.imageURL;
            }
          }

          let item = {
            name: itemName || value,
            href: href,
            imageURL: imageURL
          };
          items.push(item);
        }
      }
    }
    // sort
    if (parameters["sort"]) {
      let newParameters = JSON.parse(JSON.stringify(parameters));
      let name = parameters["sort"];
      switch (name) {
        case "sales": {
          name = "Сортировать по: продажам";
          break;
        }
        case "price-asc": {
          name = "Сортировать по: цене | от низкой";
          break;
        }
        case "price-desc": {
          name = "Сортировать по: цене | от высокой";
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
    this.quantity = data.count;
    this.items = items;
    this.requestUpdate();
  }
}

customElements.define(
  "ht-elements-catalog-selected-filters",
  HTElementsCatalogSelectedFilters
);
