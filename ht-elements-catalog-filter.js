"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "./ht-elements-catalog-filter-section.js";
import "./ht-elements-catalog-filter-block-categories.js";
import "./ht-elements-catalog-filter-block-platform.js";
import "./ht-elements-catalog-filter-block-browsers.js";
import "./ht-elements-catalog-filter-block-tools.js";
import "./ht-elements-catalog-filter-block-tags.js";

class HTElementsCatalogFilter extends LitElement {
  render() {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        #container {
          display:flex;
          align-content: flex-start;
          flex-wrap: wrap;
          width:100%;
          border-radius:3px;
        }

        ht-elements-catalog-filter-section {
          width:100%;
          margin-bottom:16px;
        }

        [hidden] {
          display:none;
        }
      </style>
      <div id="container">
        <ht-elements-catalog-filter-section name="Категория">
          <ht-elements-catalog-filter-block-categories .parameters=${
            this.parameters
          }></ht-elements-catalog-filter-block-categories>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Платформа">
          <ht-elements-catalog-filter-block-platform .parameters=${
            this.parameters
          }></ht-elements-catalog-filter-block-platform>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Совместимые браузеры">
          <ht-elements-catalog-filter-block-browsers .parameters=${
            this.parameters
          }></ht-elements-catalog-filter-block-browsers>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Инструменты">
          <ht-elements-catalog-filter-block-tools .parameters=${
            this.parameters
          }></ht-elements-catalog-filter-block-tools>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name="Теги">
          <ht-elements-catalog-filter-block-tags .parameters=${
            this.parameters
          }></ht-elements-catalog-filter-block-tags>
        </ht-elements-catalog-filter-section>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter";
  }

  static get properties() {
    return {
      parameters: { type: Object }
    };
  }

  constructor() {
    super();
    this.parameters = {};
  }

  get categories() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-filter-block-categories"
    );
  }

  get platform() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-filter-block-platform"
    );
  }

  get browsers() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-filter-block-browsers"
    );
  }

  get tools() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-filter-block-tools"
    );
  }

  get tags() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-filter-block-tags"
    );
  }

  set data(data) {
    this.categories.data = data.categories;
    this.platform.data = data.platform;
    this.browsers.data = data.browsers;
    this.tools.data = data.tools;
    this.tags.data = data.tags;
  }
}

customElements.define(HTElementsCatalogFilter.is, HTElementsCatalogFilter);
