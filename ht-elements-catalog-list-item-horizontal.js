"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "ht-image";
import "ht-user-avatar";
class HTElementsCatalogListItemHorizontal extends LitElement {
  _render({ data }) {
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
          margin:0 4px;
        }


        header {
          flex: 3 0;
          min-width:310px;
          overflow: hidden;
        }

        section {
            display:flex;
            flex-direction:column;
            flex: 3 0;
            padding:16px;
        }

        footer {
          margin:16px;
          padding-left:16px;
          border-left: 1px solid var(--divider-color);
          display: flex;
          flex-direction: column;
          flex: 2 0;
        }

        #container {
          contain: content;
          border-radius:3px;
          display:flex;
          width:100%;
          overflow:hidden;
          background: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        #name {
            max-height: 50px;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.3;
            margin-bottom:8px;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        
        #author {
          display:flex;
          position:relative;
          align-items:center;
          margin:0;
          color: var(--secondary-text-color);
        }

        #price {
          font-size: 16px;
          font-weight:600;
          text-transform: uppercase;
        }

        #updated {
          margin-top: 16px;
          font-size: 12px;
          color: var(--secondary-text-color);
        }

        #sales {
          margin-top: 4px;
          font-size:12px;
          color: var(--secondary-text-color);
        }

        [hidden] {
          display:none;
        }
      </style>
      <article id="container">
          <header>
            <a href="/data/${data.nameInURL}">
              <ht-image placeholder=${data.thumb_w60} image=${
      data.thumb_w960
    } size="16x9"></ht-image>
            </a>
          </header>
          <section>
            <a id="name" href="/data/${data.nameInURL}">${data.name}</a>
            <div id="author">от <ht-user-avatar data=${
              data.usersData
            } size="32" verifiedSize$=${12}></ht-user-avatar><a href="/user/${
      data.usersData.nickname
    }">${data.usersData.displayName}</a>
                </div>
          </section>
          <footer>
          <div id="price" style=${
            this.getPrice(data.price) === "Free"
              ? "color:var(--accent-color);"
              : ""
          }>${this.getPrice(data.price)}</div>
          <div id="updated">Последнее обновление: ${
            data.updated ? new Date(data.updated).toLocaleDateString() : ""
          }</div>
          <div id="sales" hidden?=${data.sales === 0 ? true : false}>Продажи: ${
      data.sales
    }</div>
          <slot name="actions"></slot>
          </footer>
      </article>
`;
  }

  static get is() {
    return "ht-elements-catalog-list-item-horizontal";
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

  getPrice(price) {
    if (price === 0) return "Free";
    return "$" + price;
  }
}

customElements.define(
  HTElementsCatalogListItemHorizontal.is,
  HTElementsCatalogListItemHorizontal
);
