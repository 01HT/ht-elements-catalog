"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "./ht-elements-catalog-filter-section.js";
import "./ht-elements-catalog-filter-block-categories.js";
import "./ht-elements-catalog-filter-block-tags.js";
import "./ht-elements-catalog-filter-block-platform.js";
class HTElementsCatalogFilter extends LitElement {
  render({ parameters }) {
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
      </style>
      <div id="container">
        <ht-elements-catalog-filter-section name$=${"Категория"}>
          <ht-elements-catalog-filter-block-categories parameters=${parameters}></ht-elements-catalog-filter-block-categories>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name$=${"Теги"}>
          <ht-elements-catalog-filter-block-tags parameters=${parameters}></ht-elements-catalog-filter-block-tags>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name$=${"Платформа"}>
          <ht-elements-catalog-filter-block-platform parameters=${parameters}></ht-elements-catalog-filter-block-platform>
        </ht-elements-catalog-filter-section>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter";
  }

  static get properties() {
    return {
      parameters: Object
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

  get tags() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-filter-block-tags"
    );
  }

  get platform() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-filter-block-platform"
    );
  }

  set data(data) {
    this.categories.data = data.categories;
    this.tags.data = data.tags;
    this.platform.data = data.platform;
  }
}

customElements.define(HTElementsCatalogFilter.is, HTElementsCatalogFilter);
