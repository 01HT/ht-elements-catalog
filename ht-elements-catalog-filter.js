"use strict";
import { LitElement, html } from "@polymer/lit-element";
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
          width:100%;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          border-radius:3px;
          margin:16px 32px 0 0;
          background:#fff;
        }
      </style>
      <div id="container">
      Фильтер
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter";
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }
}

customElements.define(HTElementsCatalogFilter.is, HTElementsCatalogFilter);
