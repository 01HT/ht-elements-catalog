"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "./ht-elements-catalog-filter-item-checkbox.js";
import "./ht-elements-catalog-filter-block-no-data.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogFiterBlockFlat extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        #container {
          display: flex;
          flex-direction: column;
        }
      `
    ];
  }

  render() {
    let { parameters, items, type } = this;
    return html`
    <div id="container">
        ${repeat(
          items,
          item => html`
        <ht-elements-catalog-filter-item-checkbox .data="${item}" .parameters="${parameters}" .type="${type}"></ht-elements-catalog-filter-item-checkbox>`
        )}
        ${
          !items || items.length === 0
            ? html`<ht-elements-catalog-filter-block-no-data></ht-elements-catalog-filter-block-no-data>`
            : ""
        }
    </div>
`;
  }

  static get properties() {
    return {
      data: { type: Array },
      items: { type: Array },
      parameters: { type: Object },
      type: { type: String }
    };
  }

  constructor() {
    super();
    this.items = [];
    this.parameters = {};
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("data")) {
      this._sortCheckedFirst(this.data, this.parameters, this.type);
      return true;
    }
    return true;
  }

  _sortCheckedFirst(items, parameters, block) {
    let sorted = items;
    let filterData = parameters[block];
    if (filterData) {
      sorted = [];
      for (let index in items) {
        let item = items[index];
        let unshift = false;
        for (let index in filterData) {
          let filterItem = filterData[index];
          if (filterItem.toLowerCase() === item.name.toLowerCase())
            unshift = true;
        }
        if (unshift) {
          sorted.unshift(item);
        } else {
          sorted.push(item);
        }
      }
    }
    this.items = sorted;
  }
}

customElements.define(
  "ht-elements-catalog-filter-block-flat",
  HTElementsCatalogFiterBlockFlat
);
