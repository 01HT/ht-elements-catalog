"use strict";
import { LitElement, html } from "@polymer/lit-element";
import { getPathFromParameters } from "./ht-elements-catalog-path-parser.js";
import "@polymer/paper-checkbox";
class HTElementsCatalogFilterItemCheckbox extends LitElement {
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
      <div id="container">
      <a href$=${this._getPath(parameters)}>
          <paper-checkbox checked?=${this.getChecked()}>${
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
    // this.parameters = {};
  }

  // isChecked() {
  //   return this.shadowRoot.querySelector("paper-checkbox").checked;
  // }

  getChecked() {
    if (this.data.name === undefined || !this.parameters.tags) return false;
    if (this.parameters.tags.indexOf(this.data.name.toLowerCase()) !== -1)
      return true;
    return false;
  }

  // change() {
  //   let parameters = JSON.parse(JSON.stringify(this.parameters));
  //   let name = this.data.name.toLowerCase();
  //   let isChecked = this.getChecked();
  //   let param = parameters[this.type];
  //   if (isChecked) {
  //     if (!param) parameters[this.type] = [name];
  //     if (param) param.push(name);
  //   }
  //   if (!isChecked) {
  //     if (param) {
  //       if (param.length === 1) {
  //         delete parameters[this.type];
  //       } else {
  //         let index = param.indexOf(name);
  //         param.splice(index, 1);
  //       }
  //     }
  //   }
  //   // this.dispatchEvent(
  //   //   new CustomEvent("parameters-changed", {
  //   //     bubbles: true,
  //   //     composed: true,
  //   //     detail: parameters
  //   //   })
  //   // );
  // }

  _getPath(parameters) {
    // console.log("_getPath");
    // if (!parameters) return;
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
    // console.log(parameters);
    return path;
  }
}
customElements.define(
  HTElementsCatalogFilterItemCheckbox.is,
  HTElementsCatalogFilterItemCheckbox
);
