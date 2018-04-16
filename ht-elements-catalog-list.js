"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { repeat } from "/node_modules/lit-html/lib/repeat.js";
import "ht-elements-catalog/ht-elements-catalog-list-item.js";
class HTElementsCatalogList extends LitElement {
  render({ items }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        .item {
          max-width:50%;
          width: 50%;
          flex:1 0 auto;
        }

        #container {
          display:flex;
          flex-wrap:wrap;
          margin: 0 -16px;
        }

        ht-elements-catalog-list-item{
          margin:16px;
        }

        @media screen and (max-width:1024px) {
          #container {
            margin: 0 -8px;
          }

          ht-elements-catalog-list-item{
            margin:8px;
          }

          .item {
            width: calc(50% - 2 * 8px);
          }
        }

        @media screen and (max-width:768px) {
          .item {
            width: calc(100% - 2 * 8px);
          }
        }

        @media screen and (max-width:650px) {
          .item {
            width: calc(50% - 2 * 8px);
          }
        }

        @media screen and (max-width:550px) {
          .item {
            width: calc(100% - 2 * 8px);
          }
        }
      </style>
      <div id="container">
      ${repeat(
        items,
        item =>
          html`<div class="item"><ht-elements-catalog-list-item data=${item}></ht-elements-catalog-list-item></div>`
      )}
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-list";
  }

  static get properties() {
    return {
      items: Array
    };
  }

  constructor() {
    super();
    this.items = [];
  }

  set data(data) {
    this.items = data;
  }
}

customElements.define(HTElementsCatalogList.is, HTElementsCatalogList);
