"use strict";
import { LitElement, html, css } from "lit-element";
import "@01ht/ht-spinner";
import "./ht-elements-catalog-search.js";
import "./ht-elements-catalog-filter.js";
import "./ht-elements-catalog-list.js";
import "./ht-elements-catalog-actions.js";
import "./ht-elements-catalog-selected-filters.js";
import {
  getParametersFromPath,
  getPathFromParameters
} from "./ht-elements-catalog-path-parser.js";
import {
  callTestHTTPFunction,
  callFirebaseHTTPFunction
} from "@01ht/ht-client-helper-functions";
import { _updateMeta } from "./ht-elements-catalog-meta-update.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalog extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        ht-elements-catalog-search {
          margin-top: 16px;
          width: 100%;
        }

        #main ht-elements-catalog-filter {
          display: flex;
          position: relative;
          width: 100%;
          min-width: 240px;
        }

        ht-elements-catalog-actions {
          width: 100%;
        }

        ht-elements-catalog-selected-filters {
          margin-top: 32px;
          width: 100%;
        }

        ht-elements-catalog-list {
          width: 100%;
          margin-top: 8px;
        }

        #container {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
        }

        #main {
          display: grid;
          grid-template-columns: 0.3fr 1fr;
          width: 100%;
          margin-top: 32px;
          grid-gap: 32px;
        }

        #list {
          display: flex;
          flex-direction: column;
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items: center;
          align-content: center;
          margin-top: 64px;
        }

        @media screen and (max-width: 1120px) {
          #main {
            grid-gap: 16px;
          }
        }

        @media screen and (max-width: 700px) {
          #main {
            grid-template-columns: 1fr;
            grid-gap: 0;
          }

          #main ht-elements-catalog-filter {
            display: none;
          }
        }

        [hidden] {
          display: none !important;
        }
      `
    ];
  }

  render() {
    const {
      firstLoading,
      loading,
      parameters,
      view,
      cartChangeInProcess,
      data
    } = this;
    return html`
      <div id="container">
        <ht-elements-catalog-search .parameters="${parameters}">
          <ht-elements-catalog-filter slot="filter" .parameters="${parameters}" .data="${
      data.filter
    }"></ht-elements-catalog-filter>
        </ht-elements-catalog-search>
        <div class="spinner-container" ?hidden="${!firstLoading}">
          <ht-spinner></ht-spinner>
        </div>
        <section id="main" ?hidden="${firstLoading}">
          <ht-elements-catalog-filter .parameters="${parameters}" .data="${
      data.filter
    }"></ht-elements-catalog-filter>
          <section id="list">
            <ht-elements-catalog-actions .view="${view}" .parameters="${parameters}"></ht-elements-catalog-actions>
            <ht-elements-catalog-selected-filters .parameters="${parameters}" .data="${data}"></ht-elements-catalog-selected-filters>
            <ht-elements-catalog-list view="${view}" ?hidden="${loading}" .cartChangeInProcess="${cartChangeInProcess}" .items="${
      data.items
    }"></ht-elements-catalog-list>
            <div class="spinner-container" ?hidden="${!loading}" .items="${
      data.items
    }">
              <ht-spinner></ht-spinner>
            </div>
          </section>
        </section>
      </div>
`;
  }

  static get properties() {
    return {
      path: { type: String },
      firstLoading: { type: Boolean },
      loading: { type: Boolean },
      parameters: { type: Object },
      view: { type: String },
      cartChangeInProcess: { type: Boolean },
      data: { type: Object }
    };
  }

  constructor() {
    super();
    this.firstLoading = true;
    this.loading = false;
    this.data = {};
    // view
    let view = localStorage.getItem("catalog-list-view-mode");
    view === null ? (this.view = "grid") : (this.view = view);
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("parameters-changed", e => {
      e.stopPropagation();
      const parameters = e.detail;
      this._updateLocation(parameters);
    });
    this.shadowRoot.addEventListener("view-changed", e => {
      e.stopPropagation();
      const view = e.detail;
      this._changeView(view);
    });
    this.shadowRoot.addEventListener("close-chip", e => {
      e.stopPropagation();
    });
  }

  set path(path) {
    this._setParameters(path);
  }

  async _setParameters(path) {
    let parameters = await getParametersFromPath(path);
    this.parameters = parameters;
    this._getItems(parameters);
  }

  async _getItems(parameters) {
    try {
      this.loading = true;
      // test callTestHTTPFunction
      // live callFirebaseHTTPFunction
      let data = await callFirebaseHTTPFunction({
        name: "httpsItemsGetCatalogPageDataIndex",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(parameters)
        }
      });
      this.data = data;
      await _updateMeta(parameters, data);
      if (this.firstLoading) this.firstLoading = false;
      this.loading = false;
    } catch (error) {
      console.log("_getItems: " + error.message);
    }
  }

  async _updateLocation(parameters) {
    let path = await getPathFromParameters(parameters);
    if (this.path === path) return;
    history.pushState(null, "", path);
    this.dispatchEvent(
      new CustomEvent("change-location", {
        bubbles: true,
        composed: true,
        detail: path
      })
    );
  }

  _changeView(view) {
    localStorage.setItem("catalog-list-view-mode", view);
    this.view = view;
  }

  _showSelectedFilters(parameters) {
    if (Object.keys(parameters).length) return true;
    return false;
  }
}

customElements.define("ht-elements-catalog", HTElementsCatalog);
