"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-spinner/paper-spinner.js";
import "./ht-elements-catalog-search.js";
import "./ht-elements-catalog-filter.js";
import "./ht-elements-catalog-list.js";
import "./ht-elements-catalog-actions.js";
import {
  getParametersFromPath,
  getPathFromParameters
} from "./ht-elements-catalog-path-parser.js";
import {
  callTestHTTPFunction,
  callFirebaseHTTPFunction
} from "ht-client-helper-functions";
class HTElementsCatalog extends LitElement {
  render({ firstLoading, loading, parameters }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        paper-spinner {
          --paper-spinner-stroke-width: 4px;
          margin-top:64px;
          width:64px;
          height:64px;
        }

        ht-elements-catalog-search {
          margin-top:16px;
          width:100%;
        }

        ht-elements-catalog-filter {
          display:flex;
          position:relative;
          min-width: 300px;
        }

        ht-elements-catalog-actions {
          margin-top:32px;
          width:100%;
        }

        ht-elements-catalog-list {
          width:100%;
        }

        #container {
          display:flex;
          width:100%;
          flex-direction: column;
          align-items:center;
        }

        #main {
          margin-top:16px;
          display: flex;
          width:100%;
        }

        #list {
          display:flex;
          flex-wrap:wrap;
          position:relative;
          width:100%;
        }

        #spinner-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items: center;
          align-content: center;
        }

        @media screen and (max-width:650px) {
          ht-elements-catalog-filter {
            display:none;
          }
        }

        [hidden] {
          display:none !important;
        }
      </style>
      <div id="container">
        <ht-elements-catalog-search parameters=${parameters}></ht-elements-catalog-search>
        <paper-spinner active?=${firstLoading} hidden?=${!firstLoading}></paper-spinner>
        <section id="main" hidden?=${firstLoading}>
          <ht-elements-catalog-filter parameters=${parameters}></ht-elements-catalog-filter>
          <section id="list">
            <ht-elements-catalog-actions parameters=${parameters}></ht-elements-catalog-actions>
            <ht-elements-catalog-list hidden?=${loading}></ht-elements-catalog-list>
            <div id="spinner-container" hidden?=${!loading}>
              <paper-spinner active?=${loading}></paper-spinner>
            </div>
          </section>
        </section>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog";
  }

  static get properties() {
    return {
      path: String,
      firstLoading: Boolean,
      loading: Boolean,
      parameters: Object
    };
  }

  constructor() {
    super();
    this.parameters = {};
    this.firstLoading = true;
    this.loading = false;
  }

  ready() {
    super.ready();
    this.shadowRoot.addEventListener("parameters-changed", e => {
      e.stopPropagation();
      const parameters = e.detail;
      this._updateLocation(parameters);
    });
  }

  set path(path) {
    this._setParameters(path);
  }

  get search() {
    return this.shadowRoot.querySelector("ht-elements-catalog-search");
  }

  get filter() {
    return this.shadowRoot.querySelector("ht-elements-catalog-filter");
  }

  get list() {
    return this.shadowRoot.querySelector("ht-elements-catalog-list");
  }

  async _setParameters(path) {
    let parameters = await getParametersFromPath(path);
    // console.log(parameters);
    this.parameters = parameters;
    this._getItems(parameters);
  }

  async _getItems(parameters) {
    try {
      this.loading = true;
      // let response = await window.firebase
      //   .functions()
      //   .httpsCallable("dbItemsGetCatalogItems")({
      //   path: path
      // });
      console.log(parameters);
      // let data = await callFirebaseHTTPFunction({
      //   name: "httpsGetCatalogPageDataIndex",
      //   options: {
      //     method: "POST",
      //     headers: new Headers({
      //       "Content-Type": "application/json"
      //     }),
      //     body: JSON.stringify(parameters)
      //   }
      // });
      let data = await callTestHTTPFunction(
        "httpsGetCatalogPageDataIndex",
        parameters
      );
      console.log(data);
      await this._setData(data);
      if (this.firstLoading) this.firstLoading = false;
      this.loading = false;
    } catch (error) {
      console.log("_getItems: " + error.message);
    }
  }

  async _setData(data) {
    try {
      this.list.data = data.items;
      this.filter.data = data.filter;
      this.loading = false;
    } catch (err) {
      console.log("_setData: " + err.message);
    }
  }

  async _updateLocation(parameters) {
    let path = await getPathFromParameters(parameters);
    if (this.path === path) return;
    console.log(path);
    window.history.pushState("page2", "Title", path);
    this.dispatchEvent(
      new CustomEvent("change-location", {
        bubbles: true,
        composed: true,
        detail: path
      })
    );
  }
}

customElements.define(HTElementsCatalog.is, HTElementsCatalog);
