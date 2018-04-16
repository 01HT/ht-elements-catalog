"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "ht-image";
import "ht-user-avatar";
class HTElementsCatalogListItem extends LitElement {
  render({ data }) {
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
          flex-direction: column;
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

        #price {
          font-size: 16px;
          font-weight:600;
          text-transform: uppercase;
          color: ${
            this.getPrice(data.license) === "Free"
              ? "var(--accent-color);"
              : "inherit;"
          }
        }

        #sales {
          font-size:12px;
          color: var(--secondary-text-color);
        }
      </style>
      <div id="container">
        <article>
          <header>
            <a href="/item/${data.nameInURL}">
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
              <a id="name" href="/item/${data.nameInURL}">${data.name}</a>
              <div id="author">от <a href="/user/${data.usersData.nickname}">${
      data.usersData.displayName
    }</a></div>
            </div>
          </section>
          <footer>
          <div id="price">${this.getPrice(data.license)}</div>
          <div id="sales">Продажи: ${data.sales}</div>
          </footer>
        </article>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-list-item";
  }

  static get properties() {
    return {
      data: Object,
      isFree: Boolean
    };
  }

  constructor() {
    super();
    this.data = {};
    this.data.usersData = {};
    this.data.license = [];
  }

  getPrice(license) {
    let price = "Free";
    license.forEach(license => {
      if (license.name === "Yunato Single") {
        price = "$" + license.price;
      }
    });
    return price;
  }
}

customElements.define(HTElementsCatalogListItem.is, HTElementsCatalogListItem);
