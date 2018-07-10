"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@01ht/ht-image";
import "@01ht/ht-user-avatar";
class HTElementsCatalogListItemVertical extends LitElement {
  _render({ data, view }) {
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

        a:hover {
          text-decoration: underline;
        }

        ht-user-avatar {
          margin-right:16px;
        }


        header {
          overflow: hidden;
        }

        section {
          display:flex;
          align-items:center;
          margin-top: 16px;
        }

        footer {
          margin-top:16px;
          display: flex;
          justify-content: space-between;
          align-items:center;
        }

        #container {
          contain: content;
          display:flex;
          flex-direction: column;
          width:100%;
          overflow:hidden;
        }

        #title {
          display: flex;
          flex-direction:column;
          font-size: 14px;
        }

        #name {
          font-size: 24px;
          line-height: 32px;
          color: #424242;
          letter-spacing: .28px;
        }
        
        #author {
          display:flex;
          margin:0;
          color: var(--secondary-text-color);
        }

        #author a {
          margin-left:4px;
        }

        #author span {
          margin-left:4px;
        }

        #info {
            display: flex;
            flex-direction: column;
        }

        #info #sales, #info #donations {
          margin-top: 4px;
        }

        #price {
          font-size: 18px;
          color:var(--secondary-text-color);
          font-weight:500;
          text-transform: uppercase;
        }

        #sales {
          font-size:12px;
          color: var(--secondary-text-color);
        }

        #donations {
          font-size:12px;
          color: var(--secondary-text-color);
        }

        #actions {
            align-self:flex-end;
        }

        [hidden] {
          display:none;
        }
      </style>
      <div id="container">
        <article>
          <header>
            <a href="/item/${data.nameInURL}/${data.itemId}">
              <ht-image placeholder=${data.thumb_w60} image=${
      data.thumb_w960
    } size="16x9"></ht-image>
            </a>
          </header>
          <section>
            <ht-user-avatar data=${
              data.usersData
            } size="42" verified-size="16"></ht-user-avatar>
            <div id="title">
              <a id="name" href="/item/${data.nameInURL}/${data.itemId}">${
      data.name
    }</a>
              <div id="author">от <a href="/user/${data.usersData.nickname}">${
      data.usersData.displayName
    }</a><span>|</span><a href="/catalog/${this._getRootCategory(
      data.categories
    ).toLowerCase()}">${this._getRootCategory(data.categories)}
    </a></div>
            </div>
          </section>
          <footer>
          <div id="info">
            <div id="price" style=${
              this._getPrice(data.price) === "Free"
                ? "color:var(--accent-color);"
                : ""
            }>${this._getPrice(data.price)}</div>
            <div id="sales" hidden?=${
              data.sales === 0 ? true : false
            }>Продажи: ${data.sales}${view}</div>
            <div id="donations" hidden?=${
              data.donations === 0 ? true : false
            }>Поддержка: ${data.donations}$ (${data.donationsAmount})</div>
          </div>
          <div id="actions">
            <slot name="actions"></slot>
          </div>
          </footer>
        </article>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-list-item-vertical";
  }

  static get properties() {
    return {
      data: Object
    };
  }

  constructor() {
    super();
    this.data = {};
    this.data.usersData = {};
  }

  _getPrice(price) {
    if (price === 0) return "Free";
    return "$" + price;
  }

  _getRootCategory(categories) {
    for (let categoryId in categories) {
      if (categories[categoryId].parentId === "root")
        return categories[categoryId].name;
    }
    return "";
  }
}

customElements.define(
  HTElementsCatalogListItemVertical.is,
  HTElementsCatalogListItemVertical
);
