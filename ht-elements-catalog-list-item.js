"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/paper-icon-button";
import "@01ht/ht-spinner";
import "./ht-elements-catalog-list-item-horizontal.js";
import "./ht-elements-catalog-list-item-vertical.js";

class HTElementsCatalogListItem extends LitElement {
  render() {
    const { data, view, cartChangeInProcess } = this;
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        #actions {
          align-self: flex-end;
          display: flex;
          justify-content: center;
          align-items:center;
          width: 100%;
          margin-top: auto;
          height:40px;
          width:auto;
        }

        ht-spinner {
          min-width: 40px;
        }

        paper-icon-button {
          min-width: 40px;
          border-radius: 50%;
          color: var(--secondary-text-color);
        }

        [hidden] {
          display:none;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-elements-catalog-list-item">
          <svg>
              <defs>
                <g id="add-shopping-cart">
                  <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"></path>
                </g>
                <g id="remove-red-eye">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                </g>
              </defs>
          </svg>
      </iron-iconset-svg>
      ${
        view === "list"
          ? html`<ht-elements-catalog-list-item-horizontal .data=${data}>
      <div id="actions" slot="actions">
        ${
          data.demoURL !== ""
            ? html`<a href=${
                data.demoURL
              } target="_blank" ?hidden=${data.demoURL === ""} rel="noopener">
              <paper-icon-button icon="ht-elements-catalog-list-item:remove-red-eye"></paper-icon-button>
            </a>`
            : null
        }
      ${
        this._showSpinner(cartChangeInProcess)
          ? html`<ht-spinner icon-button></ht-spinner>`
          : html`<paper-icon-button icon="ht-elements-catalog-list-item:add-shopping-cart" alt="Добавить элемент в корзину" @click=${_ => {
              this._addToCart();
            }} ?hidden=${data && data.price === 0}></paper-icon-button>`
      }
      </div>
      </ht-elements-catalog-list-item-horizontal>`
          : html`<ht-elements-catalog-list-item-vertical .data=${data}>
      <div id="actions" slot="actions">
        ${
          data.demoURL !== ""
            ? html`<a href=${
                data.demoURL
              } target="_blank" ?hidden=${data.demoURL === ""} rel="noopener">
              <paper-icon-button icon="ht-elements-catalog-list-item:remove-red-eye"></paper-icon-button>
            </a>`
            : null
        }
      ${
        this._showSpinner(cartChangeInProcess)
          ? html`<ht-spinner icon-button></ht-spinner>`
          : html`<paper-icon-button icon="ht-elements-catalog-list-item:add-shopping-cart" alt="Добавить элемент в корзину" @click=${_ => {
              this._addToCart();
            }} ?hidden=${data && data.price === 0}></paper-icon-button>`
      }
      </div></ht-elements-catalog-list-item-vertical>`
      }
`;
  }

  static get is() {
    return "ht-elements-catalog-list-item";
  }

  static get properties() {
    return {
      data: { type: Object },
      view: { type: String },
      cartChangeInProcess: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.waitUntilCartAdd = false;
  }

  _showSpinner(cartChangeInProcess) {
    if (!cartChangeInProcess) {
      this.waitUntilCartAdd = false;
      return false;
    }
    if (cartChangeInProcess && this.waitUntilCartAdd) return true;
  }

  _addToCart() {
    if (this.cartChangeInProcess) return;
    this.waitUntilCartAdd = true;
    this.dispatchEvent(
      new CustomEvent("add-to-cart", {
        bubbles: true,
        composed: true,
        detail: {
          itemId: this.data.itemId,
          licensetypeId: "lprhp51XIs962tedCeyq"
        }
      })
    );
  }
}

customElements.define(HTElementsCatalogListItem.is, HTElementsCatalogListItem);
