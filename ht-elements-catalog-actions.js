"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-iconset-svg";
import "@polymer/iron-icon";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-listbox";
import "@polymer/paper-item/paper-item.js";

class HTElementsCatalogActions extends LitElement {
  static styles = css`<style>
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

        paper-listbox {
            width: 100%;
            --paper-listbox-background-color: #fff;
        }

        paper-item {
            cursor:pointer;
        }

        #container {
          display: flex;
          justify-content:flex-end;
          align-items:center;
          width:100%;
          height:46px;
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
          position: relative;
          display: flex;
          align-items: center;
          margin-left: 16px;
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
      </style>`;

  render() {
    const { parameters, view } = this;
    return html`
      <iron-iconset-svg size="24" name="ht-elements-catalog-actions">
          <svg>
              <defs>
                <g id="view-list"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"></path></g>
                <g id="view-module"><path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"></path></g>
              </defs>
          </svg>
      </iron-iconset-svg>
      <div id="container">
        <div id="usd">Цены указаны в USD | Оплата производится в RUB | Курс ЦБ РФ</div>
        <div id="divider"></div>
        <div id="actions">
        <iron-icon id="list" icon="ht-elements-catalog-actions:view-list" ?view="${view ===
          "list"}" @click="${e => {
      this._changeView(e);
    }}"></iron-icon>
            <iron-icon id="grid" icon="ht-elements-catalog-actions:view-module" ?view="${view ===
              "grid"}" @click="${e => {
      this._changeView(e);
    }}"></iron-icon>
            <div id="select-container">
              <!-- placeholder="новизне" -->
              <paper-dropdown-menu label="сортировать по" always-float-label no-animations @iron-select="${e => {
                this._onChange();
              }}">
                <paper-listbox slot="dropdown-content" class="dropdown-content" attr-for-selected="value" setSort="${this._setSort(
                  parameters
                )}">
                    <paper-item value="">новизне</paper-item>
                    <paper-item value="sales">продажам</paper-item>
                    <!--paper-item value="trending">Популярности<paper-item>
                    <paper-item value="rating">Лучшему рейтингу<paper-item>-->
                    <paper-item value="price-asc">цене | от низкой</paper-item>
                    <paper-item value="price-desc">цене | от высокой</paper-item>
                </paper-listbox>
              </paper-dropdown-menu>
            </div>
        </div>
      </div>
`;
  }

  static get properties() {
    return {
      parameters: { type: Object },
      view: { type: String }
    };
  }

  constructor() {
    super();
    this.parameters = {};
    this.view = "grid";
  }

  firstUpdated() {
    this.listbox.selected = "";
  }

  get listbox() {
    return this.shadowRoot.querySelector("paper-listbox");
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

  _setSort() {
    if (this.listbox === null) return;
    let sort = this.parameters.sort;
    if (sort === undefined) {
      this.listbox.selected = "";
    } else {
      this.listbox.selected = sort;
    }
  }

  _onChange() {
    let sort = this.listbox.selected;
    if (sort === "" && this.parameters.sort === undefined) {
      this.listbox.selected = "";
      return;
    }
    let parameters = Object.assign({}, this.parameters);
    if (sort === "" && parameters.sort) delete parameters["sort"];
    if (sort !== "") parameters.sort = sort;
    this.dispatchEvent(
      new CustomEvent("parameters-changed", {
        bubbles: true,
        composed: true,
        detail: parameters
      })
    );
  }
}

customElements.define("ht-elements-catalog-actions", HTElementsCatalogActions);
