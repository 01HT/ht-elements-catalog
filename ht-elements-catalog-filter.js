"use strict";
import { LitElement, html, css } from "lit-element";
import "./ht-elements-catalog-filter-section.js";
import "./ht-elements-catalog-filter-block-tree.js";
import "./ht-elements-catalog-filter-block-flat.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogFilter extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        #container {
          display: flex;
          align-content: flex-start;
          flex-wrap: wrap;
          width: 100%;
          border-radius: 3px;
        }

        ht-elements-catalog-filter-section {
          width: 100%;
          margin-bottom: 16px;
        }
      `
    ];
  }

  render() {
    const { parameters, data } = this;
    return html`
      <div id="container">
        <ht-elements-catalog-filter-section name="Категория">
          <ht-elements-catalog-filter-block-tree .parameters="${parameters}" .items="${
      data.categories
    }" type="categories"></ht-elements-catalog-filter-block-tree>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Направление">
          <ht-elements-catalog-filter-block-tree .parameters="${parameters}" .items="${
      data.direction
    }" type="direction"></ht-elements-catalog-filter-block-tree>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Платформа">
          <ht-elements-catalog-filter-block-tree .parameters="${parameters}" .items="${
      data.platform
    }" type="platform"></ht-elements-catalog-filter-block-tree>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Языки">
          <ht-elements-catalog-filter-block-flat .parameters="${parameters}" .data="${
      data.languages
    }" type="languages"></ht-elements-catalog-filter-block-flat>
        </ht-elements-catalog-filter-section>
         <ht-elements-catalog-filter-section name="Инструменты">
          <ht-elements-catalog-filter-block-flat .parameters="${parameters}" .data="${
      data.tools
    }" type="tools"></ht-elements-catalog-filter-block-flat>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Совместимые браузеры">
          <ht-elements-catalog-filter-block-flat .parameters="${parameters}" .data="${
      data.browsers
    }" type="browsers"></ht-elements-catalog-filter-block-flat>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Теги">
          <ht-elements-catalog-filter-block-flat .parameters="${parameters}" .data="${
      data.tags
    }" type="tags"></ht-elements-catalog-filter-block-flat>
        </ht-elements-catalog-filter-section>
      </div>
`;
  }

  static get properties() {
    return {
      parameters: { type: Object },
      data: { type: Object }
    };
  }

  shouldUpdate() {
    if (this.data && this.parameters) return true;
    return false;
  }
}

customElements.define("ht-elements-catalog-filter", HTElementsCatalogFilter);
