"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon/iron-icon.js";
import { getPathFromParameters } from "./ht-elements-catalog-path-parser.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogFilterItem extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        a {
          display: flex;
          font-size: 14px;
          align-items: center;
          color: inherit;
          text-decoration: none;
          font-weight: 600;
        }

        iron-icon {
          margin-right: 2px;
          color: var(--secondary-text-color);
        }

        #container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 35px;
        }

        #inner {
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

        [hidden] {
          display: none;
        }
      `
    ];
  }
  render() {
    const { data, parameters } = this;
    return html`
       <iron-iconset-svg size="24" name="ht-elements-catalog-filter-item">
          <svg>
            <defs>
                <g id="chevron-left"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g>
            </defs>
          </svg>
      </iron-iconset-svg>
        <div id="container">
            <a href="${this._getPath(parameters)}" style="${this._getItemStyle(
      data
    )}">
                <iron-icon icon="ht-elements-catalog-filter-item:chevron-left" ?hidden="${data.child ||
                  data.current}"></iron-icon>
                  <div id="inner">${
                    data.imageURL
                      ? html`<img src="${data.imageURL}" alt="${data.name}">`
                      : ""
                  }${data.name}</div>
            </a>
            <div id="number">${data.number}</div>
        </div>
`;
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

  _getPath() {
    let path = "";
    if (this.data.parameter === undefined) return;
    let parameters = JSON.parse(JSON.stringify(this.parameters));
    parameters[this.type] = this.data.parameter;
    path = getPathFromParameters(parameters);
    return path;
  }

  _getItemStyle(data) {
    if (data.child) return "font-weight:400;padding-left:24px";
    if (data.current) return "font-weight:600;padding-left:8px";
    return "";
  }
}
customElements.define(
  "ht-elements-catalog-filter-item",
  HTElementsCatalogFilterItem
);
