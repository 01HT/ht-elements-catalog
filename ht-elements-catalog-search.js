"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-button";
class HTElementsCatalogSearch extends LitElement {
  render({ parameters }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        input {
          outline: none;
          width: 100%;
          font-size: 16px;
          color: #1a1a1a;
          border: 1px solid var(--divider-color);
          background-color: #fff;
          padding: 16px 24px;
          border-radius:3px;
        }

        input:focus {
          border-color: #ccc;
        }

        paper-button {
          margin:0;
          padding: 8px 24px;
          background: var(--accent-color);
          color:#fff;
          font-weight:500;
          margin-left:-3px;
          border-top-left-radius:0;
          border-bottom-left-radius:0;
        }

        #container {
          display: flex;
        }
      </style>
      <div id="container">
        <input type="text" autofocus value$="${
          parameters.search
        }" placeholder="Поиск" on-keydown=${e => {
      this._checkEnter(e);
    }}>
        <paper-button onclick=${e => {
          this._search();
        }}>Поиск</paper-button>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-search";
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

  get input() {
    return this.shadowRoot.querySelector("input");
  }

  // get data() {
  //   if (this.input.value === null) return "";
  //   return this.input.value.trim();
  // }

  // set data(data) {
  //   this.value = data.trim();
  // }

  // set parameters(parameters) {
  //   // this.parameters = parameters;
  //   // console.log(parameters);
  //   const search = parameters.search;
  //   // console.log(search);
  //   if (search !== undefined) {
  //     this.value = search.trim();
  //   } else {
  //     this.value = "";
  //   }
  // }

  _checkEnter(e) {
    if (e.keyCode === 13) this._search();
  }

  _search() {
    let parameters = Object.assign({}, this.parameters);
    parameters.search = this.input.value.trim().toLowerCase();
    this.dispatchEvent(
      new CustomEvent("parameters-changed", {
        bubbles: true,
        composed: true,
        detail: parameters
      })
    );
  }
}

customElements.define(HTElementsCatalogSearch.is, HTElementsCatalogSearch);
