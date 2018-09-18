"use strict";
import { LitElement, html } from "@polymer/lit-element";
class HTElementsCatalogFilterBlockNoData extends LitElement {
  render() {
    return html`
      <style>
        :host {
            display: block;
            position:relative;
            box-sizing:border-box;
        }

        #no-data {
          color:var(--secondary-text-color);
          margin-left:16px;
        }
      </style>
      <div id="no-data">Нет данных</div>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter-block-no-data";
  }
}

customElements.define(
  HTElementsCatalogFilterBlockNoData.is,
  HTElementsCatalogFilterBlockNoData
);
