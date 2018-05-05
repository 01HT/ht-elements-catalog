"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "ht-image";
import "ht-user-avatar";
class HTElementsCatalogListItemVertical extends LitElement {
  render({ data, view }) {
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
          margin-right:8px;
        }


        header {
          overflow: hidden;
        }

        section {
          display:flex;
          align-items:center;
          margin:16px;
        }

        footer {
          margin:16px;
          display: flex;
          justify-content: space-between;
        }

        #container {
          contain: content;
          border-radius:3px;
          display:flex;
          flex-direction: column;
          width:100%;
          overflow:hidden;
          background: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        #title {
          display: flex;
          flex-direction:column;
          font-size: 14px;
        }

        #name {
          font-weight: 500;
        }
        
        #author {
          display:flex;
          margin:0;
          color: var(--secondary-text-color);
        }

        #author a {
          margin-left:4px;
        }

        #info {
            display: flex;
            flex-direction: column;
        }

        #price {
          font-size: 16px;
          font-weight:600;
          text-transform: uppercase;
          color: ${
            this.getPrice(data.price) === "Free"
              ? "var(--accent-color);"
              : "inherit;"
          }
          }

        #sales {
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
            <a href="/data/${data.nameInURL}">
              <ht-image placeholder=${data.thumb_w60} image=${
      data.thumb_w960
    } size=${"16x9"}></ht-image>
            </a>
          </header>
          <section>
            <ht-user-avatar data=${
              data.usersData
            } size="42" verified-size="16"></ht-user-avatar>
            <div id="title">
              <a id="name" href="/data/${data.nameInURL}">${data.name}</a>
              <div id="author">от <a href="/user/${data.usersData.nickname}">${
      data.usersData.displayName
    }</a></div>
            </div>
          </section>
          <footer>
          <div id="info">
            <div id="price">${this.getPrice(data.price)}</div>
            <div id="sales" hidden?=${
              data.sales === 0 ? true : false
            }>Продажи: ${data.sales}${view}</div>
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

  getPrice(price) {
    if (price === 0) return "Free";
    return "$" + price;
  }
}

customElements.define(
  HTElementsCatalogListItemVertical.is,
  HTElementsCatalogListItemVertical
);
