"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/paper-spinner/paper-spinner.js";
import "ht-elements-catalog/ht-elements-catalog-search.js";
import "ht-elements-catalog/ht-elements-catalog-filter.js";
import "ht-elements-catalog/ht-elements-catalog-list.js";
class HTElementsCatalog extends LitElement {
  render({ firstLoading, loading }) {
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
          flex-direction: column;
          align-items:center;
          justify-content:center;
          position:relative;
          width:100%;
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
        <ht-elements-catalog-search></ht-elements-catalog-search>
        <paper-spinner active?=${firstLoading} hidden?=${!firstLoading}></paper-spinner>
        <section id="main" hidden?=${firstLoading}>
          <ht-elements-catalog-filter></ht-elements-catalog-filter>
          <section id="list">
            <paper-spinner active?=${loading} hidden?=${!loading}></paper-spinner>
            <ht-elements-catalog-list hidden?=${loading}></ht-elements-catalog-list>
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
      loading: Boolean
    };
  }

  constructor() {
    super();
    this.currentPath = "";
    this.firstLoading = true;
    this.loading = false;
  }

  ready() {
    super.ready();
    this.shadowRoot.addEventListener("changed", e => {
      this._onChange(e);
    });
  }

  get path() {
    return this.currentPath;
  }

  set path(path) {
    if (path === this.currentPath) return;
    this.currentPath = path;
    console.log(path);
    this._getItems(path);
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

  async _getItems(path) {
    try {
      // console.log(path);
      this.loading = true;
      let response = await window.firebase
        .functions()
        .httpsCallable("dbItemsGetCatalogItems")({
        path: path
      });
      console.log(response);
      this.list.data = response.data.items;
      if (this.firstLoading) this.firstLoading = false;
      this.loading = false;
    } catch (err) {
      console.log("_getItems: " + err.message);
    }
  }

  _onChange(e) {
    e.stopPropagation();
    this._generatePath();
  }

  _generatePath() {
    let path = "/catalog/all";
    // Add location.search
    // locationSearch.replace(locationSearch.charAt(0), "?");
    // &term
    let term = this.search.data;
    if (term !== "") path += `?term=${term}`;
    // if (this.currentPath === path) return;
    // console.log(path);
    this._updateLocation(path);
  }

  _updateLocation(path) {
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
