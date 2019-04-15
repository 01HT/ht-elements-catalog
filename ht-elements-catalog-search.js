"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/paper-icon-button";
import "./ht-elements-catalog-search-speech-mic.js";
import { installMediaQueryWatcher } from "pwa-helpers/media-query.js";
import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogSearch extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        input {
          outline: none;
          border: none;
          width: 100%;
          font-size: 16px;
          color: #1a1a1a;
          height: 54px;
          margin-left: 16px;
        }

        paper-icon-button {
          min-width: 40px;
          margin: 0 2px;
          padding: 0 8px;
          color: var(--secondary-text-color);
        }

        #container {
          display: flex;
          align-items: center;
          border-radius: 2px;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16),
            0 0 0 1px rgba(0, 0, 0, 0.08);
          transition: box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 8px;
          height: 56px;
        }

        #filter-container {
          position: absolute;
          width: calc(100% - 34px);
          z-index: 9;
          overflow: hidden;
          padding: 16px;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fff;
          top: 57px;
          left: 0;
          height: calc(100vh - 200px);
          box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(0, 0, 0, 0.08);
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
          max-width: 100%;
          width: 100%;
        }

        @media screen and (min-width: 700px) {
          #filter-toggle {
            display: none;
          }
        }

        [hidden] {
          display: none;
        }
      `
    ];
  }

  render() {
    const { parameters, opened, clearButtonVisible } = this;
    return html`
      <iron-iconset-svg size="24" name="ht-elements-catalog-search">
          <svg>
              <defs>
                <g id="search"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g>
                <g id="tune"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g>
                <g id="arrow-back"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></g>
                <g id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
       <paper-icon-button id="search-button" alt="Поиск" toggles icon="ht-elements-catalog-search:search" @click="${
         this._search
       }" ?hidden="${clearButtonVisible}"></paper-icon-button>
       <paper-icon-button id="clear-toggle" alt="Очистить поле поиска" toggles icon="ht-elements-catalog-search:arrow-back" @click="${
         this._clear
       }" ?hidden="${!clearButtonVisible}"></paper-icon-button>
        <input type="text" aria-label="Поиск" autofocus .value="${
          parameters.search ? parameters.search : ""
        }" placeholder="Поиск" @change="${e => {
      this._onInputChange(e);
    }}" @keyup="${e => {
      this._onInputKeyUp(e);
    }}"> 

        <ht-elements-catalog-search-speech-mic continuous @result="${e =>
          this._micResult(e)}"></ht-elements-catalog-search-speech-mic>

        <paper-icon-button id="filter-toggle" alt="Открыть настройки фильтра" toggles icon="ht-elements-catalog-search:${
          opened ? "close" : "tune"
        }" @click="${e => {
      this.toggleFilter();
    }}">
        </paper-icon-button>
       
        <div id="filter-container" ?hidden="${!opened}">
          <slot name="filter"></slot>
        </div>

      </div>
`;
  }

  static get properties() {
    return {
      parameters: { type: Object },
      opened: { type: Boolean },
      clearButtonVisible: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.parameters = {};
    this.opened = false;
    this.clearButtonVisible = false;
    this._currentTimerId = undefined;
  }

  firstUpdated() {
    installMediaQueryWatcher(
      `(min-width: 700px)`,
      matches => (this.opened = false)
    );
    this._updateClearButtonState();
  }

  get input() {
    return this.shadowRoot.querySelector("input");
  }

  _updateClearButtonState() {
    this.input.value !== ""
      ? (this.clearButtonVisible = true)
      : (this.clearButtonVisible = false);
  }

  _onInputChange() {
    this._updateClearButtonState();
  }

  _onInputKeyUp(e) {
    this._updateClearButtonState();
    if (this._currentTimerId !== undefined) {
      clearTimeout(this._currentTimerId);
      this._currentTimerId = undefined;
    }
    if (e.keyCode === 13) {
      this._search();
      return;
    }
    this._currentTimerId = setTimeout(_ => {
      this._search();
    }, 400);
  }

  _search() {
    let parameters = Object.assign({}, this.parameters);
    parameters.search = this.input.value.trim();
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

  _clear() {
    this.input.value = "";
    this._updateClearButtonState();
    let parameters = Object.assign({}, this.parameters);
    delete parameters["search"];
    this.dispatchEvent(
      new CustomEvent("parameters-changed", {
        bubbles: true,
        composed: true,
        detail: parameters
      })
    );
  }

  _micResult(e) {
    console.log(e);
    this.input.value = e.detail.completeTranscript.trim();
    this._search();
    this._updateClearButtonState();
  }
}

customElements.define("ht-elements-catalog-search", HTElementsCatalogSearch);
