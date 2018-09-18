"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "./ht-elements-catalog-filter-item.js";
import "./ht-elements-catalog-filter-block-no-data.js";

class HTElementsCatalogFiterBlockCategories extends LitElement {
  render() {
    const { parameters, items } = this;
    return html`
      <style>
        :host {
            display: block;
            position:relative;
            box-sizing:border-box;
        }

        #container {
            display:flex;
            flex-direction: column;
        }

        #number {
            color:var(--secondary-text-color);
        }
      </style>
      <div id="container">
      ${repeat(
        items,
        item =>
          html`<ht-elements-catalog-filter-item .data=${item} .parameters=${parameters} type="categories"></ht-elements-catalog-filter-item>`
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
    return "ht-elements-catalog-filter-block-categories";
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

  set data(data) {
    this.items = data;
  }
}

customElements.define(
  HTElementsCatalogFiterBlockCategories.is,
  HTElementsCatalogFiterBlockCategories
);
