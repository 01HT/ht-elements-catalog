"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg";
import "@polymer/paper-icon-button/paper-icon-button.js";
import { getPathFromParameters } from "./ht-elements-catalog-path-parser.js";
class HTElementsCatalogFilterItem extends LitElement {
  render({ data, parameters }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        a {
          display:block;
          color:inherit;
          text-decoration: none;
        }

        #container {
          display:flex;
          align-items: center;
          justify-content: space-between;
          padding:8px;
        }

        #number {
          color:var(--secondary-text-color);
        }
      </style>
       <iron-iconset-svg size="24" name="ht-elements-catalog-filter-item">
          <svg>
            <defs>
                <g id="chevron-left"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g>
            </defs>
          </svg>
      </iron-iconset-svg>
        <div id="container">
            <a href$=${this._getPath(parameters)}>
                <paper-icon-button icon="ht-elements-catalog-filter-item:chevron-left"></paper-icon-button>
                <div>${data.name}</div>
            </a>
            <div id="number">${data.number}</div>
        </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter-item";
  }

  static get properties() {
    return {
      data: Object,
      type: String,
      parameters: Object
    };
  }

  constructor() {
    super();
    this.data = {};
    this.type = "";
    this.parameters = {};
  }

  isChecked() {
    return this.shadowRoot.querySelector("paper-checkbox").checked;
  }

  getChecked() {
    if (this.data.name === undefined || !this.parameters.tags) return false;
    if (this.parameters.tags.indexOf(this.data.name.toLowerCase()) !== -1)
      return true;
    return false;
  }

  change() {
    let parameters = JSON.parse(JSON.stringify(this.parameters));
    let name = this.data.name.toLowerCase();
    let isChecked = this.getChecked();
    let param = parameters[this.type];
    if (isChecked) {
      if (!param) parameters[this.type] = [name];
      if (param) param.push(name);
    }
    if (!isChecked) {
      if (param) {
        if (param.length === 1) {
          delete parameters[this.type];
        } else {
          let index = param.indexOf(name);
          param.splice(index, 1);
        }
      }
    }
    // this.dispatchEvent(
    //   new CustomEvent("parameters-changed", {
    //     bubbles: true,
    //     composed: true,
    //     detail: parameters
    //   })
    // );
  }

  _getPath() {
    // let path = "";
    // if (this.data.name === undefined) return;
    // let parameters = JSON.parse(JSON.stringify(this.parameters));
    // let name = this.data.name.toLowerCase();
    // let isChecked = this.getChecked();
    // let param = parameters[this.type];
    // if (isChecked) {
    //   let index = param.indexOf(name);
    //   param.splice(index, 1);
    // }
    // if (!isChecked) {
    //   if (!param) parameters[this.type] = [name];
    //   if (param) param.push(name);
    // }
    // path = getPathFromParameters(parameters);
    // return path;
  }
}
customElements.define(
  HTElementsCatalogFilterItem.is,
  HTElementsCatalogFilterItem
);
