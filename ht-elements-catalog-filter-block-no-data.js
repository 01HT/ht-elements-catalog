"use strict";
import { LitElement, html, css } from "lit-element";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogFilterBlockNoData extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        #no-data {
          color: var(--secondary-text-color);
          margin-left: 16px;
        }
      `
    ];
  }

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
