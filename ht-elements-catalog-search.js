"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/paper-icon-button";
import "@polymer/paper-button";
import { installMediaQueryWatcher } from "pwa-helpers/media-query.js";
class HTElementsCatalogSearch extends LitElement {
  _render({ parameters, opened }) {
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

        paper-icon-button {
          position: absolute;
          top: 6px;
          right: 90px;
          color: var(--secondary-text-color);
        }

        #container {
          display: flex;
        }

        #filter-container {
          border: 1px solid #ddd;
          position: absolute;
          width: calc(100% - 34px);
          z-index: 9;
          overflow: hidden;
          padding: 16px;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fff;
          top: 50px;
          height: calc(100vh - 148px);
        }

        ::-webkit-scrollbar-track {
            background-color: #e6e6e6;
        }

        ::-webkit-scrollbar {
            width: 8px;
            background-color: #e6e6e6;
        } 

        ::-webkit-scrollbar-thumb {
            background-color: #b3b3b3;
        }

        ::slotted(ht-elements-catalog-filter) {
          max-width:100%;
          width:100%;
        }
        
        @media screen and (min-width:700px) {
         paper-icon-button {
            display:none;
          }
        }

        [hidden] {
          display:none;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-elements-catalog-search">
          <svg>
              <defs>
                <g id="tune"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g>
                <g id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <input type="text" autofocus value$="${
          parameters.search
        }" placeholder="Поиск" on-keydown=${e => {
      this._checkEnter(e);
    }}>
        <paper-icon-button toggles icon="ht-elements-catalog-search:${
          opened ? "close" : "tune"
        }" on-click=${e => {
      this.toggleFilter();
    }}></paper-icon-button>
        <paper-button onclick=${e => {
          this._search();
        }}>Поиск</paper-button>

        <div id="filter-container" hidden?=${opened ? false : true}>
          <slot name="filter"></slot>
        </div>

      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-search";
  }

  static get properties() {
    return {
      parameters: Object,
      opened: Boolean
    };
  }

  constructor() {
    super();
    this.parameters = {};
    this.opened = false;
  }

  ready() {
    super.ready();
    installMediaQueryWatcher(
      `(min-width: 700px)`,
      matches => (this.opened = false)
    );
  }

  get input() {
    return this.shadowRoot.querySelector("input");
  }

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

  toggleFilter() {
    this.opened = !this.opened;
  }
}

customElements.define(HTElementsCatalogSearch.is, HTElementsCatalogSearch);
