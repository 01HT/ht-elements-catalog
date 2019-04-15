"use strict";
import { LitElement, html, css } from "lit-element";
import { getPathFromParameters } from "./ht-elements-catalog-path-parser.js";
import "@polymer/paper-checkbox";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogFilterItemCheckbox extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        a {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        paper-checkbox {
          font-size: 14px;
        }

        #container {
          display: flex;
          justify-content: space-between;
          margin-left: 8px;
          align-items: center;
          min-height: 35px;
        }

        #checkbox-inner {
          display: flex;
          align-items: center;
        }

        img {
          margin-right: 8px;
          display: block;
          width: 24px;
          height: 24px;
        }

        #number {
          margin-left: 16px;
          color: var(--secondary-text-color);
        }
      `
    ];
  }

  render() {
    const { data, href } = this;
    return html`
      <div id="container">
      <a href="${href}">
          <paper-checkbox noink ?checked="${this.getChecked()}">
          <div id="checkbox-inner">${
            data.imageURL
              ? html`<img src="${data.imageURL}" alt="${data.name}">`
              : ""
          }${data.name}</div>
          </paper-checkbox>
      </a>
      <div id="number">${data.number}</div>
      </div>
`;
  }

  static get properties() {
    return {
      data: { type: Object },
      type: { type: String },
      parameters: { type: Object },
      href: { type: String }
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

  updated() {
    this._updateHref();
  }

  async _updateHref() {
    if (this.data.name === undefined) return;
    let parameters = JSON.parse(JSON.stringify(this.parameters));
    let name = this.data.name;
    let param = parameters[this.type];
    let isChecked = this.getChecked();
    if (isChecked) {
      let index = param.indexOf(name);
      param.splice(index, 1);
    }
    if (!isChecked) {
      if (!param) param = [name];
      if (param && param.indexOf(name) === -1) param.push(name);
    }
    parameters[this.type] = param;
    this.href = await getPathFromParameters(parameters);
  }
}
customElements.define(
  "ht-elements-catalog-filter-item-checkbox",
  HTElementsCatalogFilterItemCheckbox
);
