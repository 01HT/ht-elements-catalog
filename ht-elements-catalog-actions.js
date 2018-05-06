"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-icon/iron-icon.js";
class HTElementsCatalogActions extends LitElement {
  render({ parameters, view }) {
    return html`
      <style>
        :host {
          display: block;
          position:relative;
          box-sizing:border-box;
        }

        iron-icon {
            color:#b3b3b3;
            cursor:pointer;
            margin-right:4px;
        }

        select {
            border: 1px solid var(--divider-color);
        }

        select{
            padding: 8px;
            width: 310px;
            font-size: 14px;
            background-color: #fff;
            border: 1px solid var(--divider-color);
            padding: 8px 16px;
            border-radius: 3px;
            cursor: pointer;
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

        @media screen and (max-width:1120px) {
          iron-icon {
            display:none;
          }
          
          #select-container {
            margin-left:0;
          }
        }

        @media screen and (max-width:960px) {
          #usd, #divider {
            display:none;
          }
        }

        [view] {
            color:var(--secondary-text-color);
        }
      </style>
      <iron-iconset-svg size="24" name="ht-elements-catalog-actions">
          <svg>
              <defs>
                <g id="view-list"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"></path></g>
                <g id="view-module"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div id="usd">Все цены указаны в долларах США</div>
        <div id="divider"></div>
        <div id="actions">
        <iron-icon id="list" icon="ht-elements-catalog-actions:view-list" view?=${
          view === "list" ? true : false
        } on-click=${e => {
      this._changeView(e);
    }}></iron-icon>
            <iron-icon id="grid" icon="ht-elements-catalog-actions:view-module" view?=${
              view === "grid" ? true : false
            } on-click=${e => {
      this._changeView(e);
    }}></iron-icon>
            <div id="select-container">
                <select value=${this._setSort(parameters)}
                  this.parameters.sort ? this.parameters.sort : ""
                }>
                    <option value="">Новизне</option>
                    <option value="sales">Продажам</option>
                    <!--<option value="trending">Популярности</option>
                    <option value="rating">Лучшему рейтингу</option>-->
                    <option value="price-asc">Цене | от низкой</option>
                    <option value="price-desc">Цене | от высокой</option>
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
      parameters: Object,
      view: String
    };
  }

  constructor() {
    super();
    this.parameters = {};
    this.view = "grid";
  }

  ready() {
    super.ready();
    this.select.addEventListener("change", e => {
      this._onChange();
    });
  }

  get select() {
    return this.shadowRoot.querySelector("select");
  }

  _setSort(parameters) {
    if (this.select === null) return;
    let sort = parameters.sort;
    if (parameters.sort === undefined) {
      this.select.value = "";
    } else {
      this.select.value = sort;
    }
    this._changeTextInOptions();
  }

  _changeView(e) {
    this.dispatchEvent(
      new CustomEvent("view-changed", {
        bubbles: true,
        composed: true,
        detail: e.target.id
      })
    );
  }

  _changeTextInOptions() {
    let options = this.shadowRoot.querySelectorAll("option");
    for (let option of options) {
      option.innerHTML = option.innerHTML.replace("Сортировать по: ", "");
      if (option.selected)
        option.innerHTML = "Сортировать по: " + option.innerHTML;
    }
  }

  _onChange() {
    let value = this.select.value;
    if (value === this.parameters.sort) return;
    this._changeTextInOptions();
    let parameters = Object.assign({}, this.parameters);
    if (value === "" && parameters.sort) {
      delete parameters["sort"];
    }
    if (value !== "") {
      parameters.sort = value;
    }
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
