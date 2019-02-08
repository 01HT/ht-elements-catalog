"use strict";
import { LitElement, html, css } from "lit-element";

class HTElementsCatalogFilterBlockNoData extends LitElement {
  static styles = css`<style>
    :host {
        display: block;
        position:relative;
        box-sizing:border-box;
    }

    #no-data {
      color:var(--secondary-text-color);
      margin-left:16px;
    }
  </style>`;

  render() {
    return html`
      <div id="no-data">Нет данных</div>
      </div>
`;
  }
}

customElements.define(
  "ht-elements-catalog-filter-block-no-data",
  HTElementsCatalogFilterBlockNoData
);
