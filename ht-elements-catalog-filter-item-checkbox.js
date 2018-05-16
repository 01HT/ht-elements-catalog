"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { getPathFromParameters } from "./ht-elements-catalog-path-parser.js";
import "@polymer/paper-checkbox";
class HTElementsCatalogFilterItemCheckbox extends LitElement {
  _render({ data, parameters }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
          overflow:hidden;
        }

        a {
          display:block;
          color:inherit;
          text-decoration: none;
        }

        paper-checkbox {
          font-size: 14px;
        }

        #container {
          display:flex;
          justify-content: space-between;
          padding-left:8px;
          align-items: center;
          height:35px;
        }

        #number {
          color:var(--secondary-text-color);
        }
      </style>
      <div id="container">
      <a href$=${this._getPath(parameters)}>
          <paper-checkbox noink checked?=${this.getChecked()}>${
      data.name
    }</paper-checkbox>
      </a>
      <div id="number">${data.number}</div>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter-item-checkbox";
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
  }

  getChecked() {
    if (this.data.name === undefined || !this.parameters[this.type])
      return false;
    if (this.parameters[this.type].indexOf(this.data.name.toLowerCase()) !== -1)
      return true;
    return false;
  }

  _getPath(parameters) {
    let path = "";
    if (this.data.name === undefined) return;
    parameters = JSON.parse(JSON.stringify(parameters));
    let name = this.data.name.toLowerCase();
    let isChecked = this.getChecked();
    let param = parameters[this.type];
    if (isChecked) {
      let index = param.indexOf(name);
      param.splice(index, 1);
    }
    if (!isChecked) {
      if (!param) parameters[this.type] = [name];
      if (param) param.push(name);
    }
    path = getPathFromParameters(parameters);
    return path;
  }
}
customElements.define(
  HTElementsCatalogFilterItemCheckbox.is,
  HTElementsCatalogFilterItemCheckbox
);
