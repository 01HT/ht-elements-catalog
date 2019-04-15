"use strict";
import { LitElement, html, css } from "lit-element";
import { repeat } from "lit-html/directives/repeat.js";
import "./ht-elements-catalog-filter-item.js";
import "./ht-elements-catalog-filter-block-no-data.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogFilterBlockTree extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        #container {
          display: flex;
          flex-direction: column;
        }

        #number {
          color: var(--secondary-text-color);
        }
      `
    ];
  }

  render() {
    const { parameters, items, type } = this;
    return html`
    <div id="container">
        ${repeat(
          items,
          item =>
            html`<ht-elements-catalog-filter-item .data="${item}" .parameters="${parameters}" .type="${type}"></ht-elements-catalog-filter-item>`
        )}
        ${
          items.length === 0
            ? html`<ht-elements-catalog-filter-block-no-data></ht-elements-catalog-filter-block-no-data>`
            : ""
        }
    </div>
`;
  }

  static get properties() {
    return {
      items: { type: Array },
      parameters: { type: Object },
      type: { type: String }
    };
  }

  shouldUpdate() {
    if (this.items && this.parameters) return true;
    return false;
  }
}

customElements.define(
  "ht-elements-catalog-filter-block-tree",
  HTElementsCatalogFilterBlockTree
);
