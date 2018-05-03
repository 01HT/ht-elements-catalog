"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-collapse";
class HTElementsCatalogFilterSection extends LitElement {
  render({ name, opened }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        #container {
          display:flex;
          flex-direction:column;
          width:100%;
          border-bottom: 1px solid var(--divider-color);
        }

        #header {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            color: #3e3f3d;
            font-weight: 500;
            cursor:pointer;
            padding:0 0 16px 8px;
            user-select: none;
        }

        #scroll {
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 214px;
          padding-right: 16px;
          margin-bottom:16px;
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
      </style>
      <iron-iconset-svg size="24" name="ht-elements-catalog-filter-section">
          <svg>
              <defs>
                <g id="expand-less"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></g>
                <g id="expand-more"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>

      <div id="container">
        <div id="header" onclick=${e => {
          this.toggle();
        }}><div>${
      this.name
    }</div><iron-icon icon="ht-elements-catalog-filter-section:${
      opened ? "expand-less" : "expand-more"
    }"></iron-icon></div>
        <iron-collapse opened=${opened}>
            <div id="scroll">
              <slot></slot>
            </div>
        </iron-collapse>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-filter-section";
  }

  static get properties() {
    return {
      name: String,
      opened: Boolean
    };
  }

  constructor() {
    super();
    this.name = "";
    this.opened = true;
  }

  toggle() {
    this.opened = !this.opened;
  }
}

customElements.define(
  HTElementsCatalogFilterSection.is,
  HTElementsCatalogFilterSection
);
