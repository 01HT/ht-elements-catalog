"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "./ht-elements-catalog-filter-section.js";
import "./ht-elements-catalog-filter-block-categories.js";
import "./ht-elements-catalog-filter-block-tags.js";
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
          flex-direction:column;
          flex-wrap: wrap;
          width:100%;
          //box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          border-radius:3px;
          margin:16px 32px 0 0;
          //background:#fff;
        }

        ht-elements-catalog-filter-section {
          width:100%;
        }
      </style>
      <div id="container">
        <ht-elements-catalog-filter-section name$=${"Категория"}>
          <ht-elements-catalog-filter-block-categories parameters=${parameters}></ht-elements-catalog-filter-block-categories>
        </ht-elements-catalog-filter-section>
        <ht-elements-catalog-filter-section name$=${"Теги"}>
          <ht-elements-catalog-filter-block-tags parameters=${parameters}></ht-elements-catalog-filter-block-tags>
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

  // get data() {
  //   let data = {};
  //   data.categories = this.categories.data;
  //   data.tags = this.tags.data;
  //   return data;
  // }

  set data(data) {
    this.categories.data = data.categories;
    this.tags.data = data.tags;
  }
}

customElements.define(HTElementsCatalogFilter.is, HTElementsCatalogFilter);
