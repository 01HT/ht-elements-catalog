"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { getPathFromParameters } from "./ht-elements-catalog-path-parser.js";
import "@polymer/paper-checkbox";

class HTElementsCatalogFilterItemCheckbox extends LitElement {
  render() {
    const { data, parameters } = this;
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

        paper-checkbox {
          font-size: 14px;
        }

        #container {
          display:flex;
          justify-content: space-between;
          margin-left:8px;
          align-items: center;
          min-height:35px;
        }

        #checkbox-inner {
          display:flex;
          align-items:center;
        }

        img {
          margin-right:8px;
          display:block;
          width:24px;
          height:24px;
        }

        #number {
          margin-left:16px;
          color:var(--secondary-text-color);
        }
      </style>
      <div id="container">
      <a href=${this._getPath(parameters)}>
          <paper-checkbox noink ?checked=${this.getChecked()}>
          <div id="checkbox-inner">${
            data.imageURL ? html`<img src=${data.imageURL}>` : ""
          }${data.name}</div>
          </paper-checkbox>
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
      data: { type: Object },
      type: { type: String },
      parameters: { type: Object }
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
    if (this.parameters[this.type].indexOf(this.data.name) !== -1) return true;
    return false;
  }

  _getPath(parameters) {
    let path = "";
    if (this.data.name === undefined) return;
    parameters = JSON.parse(JSON.stringify(parameters));
    let name = this.data.name;
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
