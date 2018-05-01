"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
class HTElementsCatalogActions extends LitElement {
  render({ parameters }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        #actions > iron-icon {
            //color:var(--secondary-text-color);
            color:#b3b3b3;
            cursor:pointer;
            margin-right:4px;
        }

        select {
            border: 1px solid var(--divider-color);
        }

        select{
            padding: 8px;
            max-width: 300px;
            font-size: 14px;
            background-color: #fff;
            border: 1px solid var(--divider-color);
            padding: 8px 16px;
            border-radius: 2px;
            cursor: pointer;
            padding-right: 40px;
        }

        #container {
          display: flex;
          justify-content:flex-end;
          align-items:center;
          width:100%;
          height:35px;
        }

        #usd {
            font-size:13px;
            color:var(--secondary-text-color);
        }

        #divider {
            width:1px;
            height:100%;
            background: var(--divider-color);
            margin:0 16px;
        }

        #actions {
            cursor: default;
            display:flex;
            align-items:center;
        }

        #select-container {
            position:relative;
            margin-left:16px;
        }

        #select-icon {
            color:var(--secondary-text-color);
            position:absolute;
            right: 8px;
            top:6px;
        }
      </style>
      <iron-iconset-svg size="24" name="ht-elements-catalog-actions">
          <svg>
              <defs>
                <g id="view-list"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"></path></g>
                <g id="view-module"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"></path></g>
                <g id="keyboard-arrow-down"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div id="usd">Все цены указаны в долларах США</div>
        <div id="divider"></div>
        <div id="actions">
            <iron-icon icon="ht-elements-catalog-actions:view-list"></iron-icon>
            <iron-icon icon="ht-elements-catalog-actions:view-module"></iron-icon>
            <div id="select-container">
                <select>
                    <option selected value="">Сортировать по: Новизне</option>
                    <option value="sales">Продажам</option>
                    <option value="trending">Популярности</option>
                    <option value="rating">Лучшему рейтингу</option>
                    <option value="price_asc">Цене | от низкой к высокой</option>
                    <option value="price_desc">Цене | от высокой к низкой</option>
                </select>
            </div>
            
        </div>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-actions";
  }

  static get properties() {
    return {
      parameters: Object
    };
  }

  constructor() {
    super();
    this.parameters = {};
  }

  ready() {
    super.ready();
    this.select.addEventListener("change", e => {
      this.changed();
    });
  }

  get select() {
    return this.shadowRoot.querySelector("select");
  }

  _search() {
    let parameters = Object.assign({}, this.parameters);
    parameters.search = this.input.value.trim().toLowerCase();
    this.dispatchEvent(
      new CustomEvent("parameters-changed", {
        bubbles: true,
        composed: true,
        detail: parameters
      })
    );
  }
}

customElements.define(HTElementsCatalogActions.is, HTElementsCatalogActions);
