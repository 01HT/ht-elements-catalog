"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "lit-html/lib/repeat.js";
import "./ht-elements-catalog-filter-item.js";
class HTElementsCatalogFilterBlockPlatform extends LitElement {
  _render({ items, parameters }) {
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
          html`<ht-elements-catalog-filter-item data=${item} parameters=${parameters} type="platform"></ht-elements-catalog-filter-item>`
      )}
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter-block-platform";
  }

  static get properties() {
    return {
      items: Array,
      parameters: Object
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
  HTElementsCatalogFilterBlockPlatform.is,
  HTElementsCatalogFilterBlockPlatform
);
