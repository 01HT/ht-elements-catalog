"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "./ht-elements-catalog-filter-item-checkbox.js";
import "./ht-elements-catalog-filter-block-no-data.js";

class HTElementsCatalogFiterBlockBrowsers extends LitElement {
  render() {
    const { parameters, items } = this;
    return html`
    <style>
        :host {
            display: block;
            position: relative;
            box-sizing: border-box;
        }
    
        #container {
            display: flex;
            flex-direction: column;
        }
    
        #number {
            color: var(--secondary-text-color);
        }
    </style>
    <div id="container">
        ${repeat(
          items,
          item => html`
            <ht-elements-catalog-filter-item-checkbox .data=${item} .parameters=${parameters} type="browsers"></ht-elements-catalog-filter-item-checkbox>`
        )}
        ${
          items.length === 0
            ? html`<ht-elements-catalog-filter-block-no-data></ht-elements-catalog-filter-block-no-data>`
            : ""
        }
    </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter-block-browsers";
  }

  static get properties() {
    return {
      items: { type: Array },
      parameters: { type: Object }
    };
  }

  constructor() {
    super();
    this.items = [];
    this.parameters = {};
  }

  get data() {
    let selected = [];
    let selectedCheckboxes = this.shadowRoot.querySelectorAll(
      "ht-elements-catalog-filter-item-checkbox"
    );
    selectedCheckboxes.forEach(checkbox => {
      if (checkbox.isChecked()) {
        selected.push(checkbox.data.name);
      }
    });
    return selected.join(",");
  }

  _sortCheckedFirst(items, parameters, block) {
    if (Object.keys(parameters).length === 0) return items;
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
    return sorted;
  }

  set data(data) {
    data = this._sortCheckedFirst(data, this.parameters, "browsers");
    this.items = data;
  }
}

customElements.define(
  HTElementsCatalogFiterBlockBrowsers.is,
  HTElementsCatalogFiterBlockBrowsers
);
