"use strict";
import { LitElement, html, css } from "lit-element";
import "@01ht/ht-image";
import "@01ht/ht-user-avatar";
import "@01ht/ht-image-slider";
import "@01ht/ht-animated-image";
import "@01ht/ht-elements-item-youtube-preview";
import "@01ht/ht-date";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalogListItemHorizontal extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        a {
          display: block;
          color: inherit;
          text-decoration: none;
          outline: none;
        }

        a:hover {
          text-decoration: underline;
        }

        ht-user-avatar {
          margin: 0 4px;
        }

        header {
          flex: 3 0;
          min-width: 310px;
          max-width: 310px;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        section {
          display: flex;
          flex-direction: column;
          flex: 3 0;
          padding: 0 16px;
        }

        footer {
          padding-left: 16px;
          border-left: 1px solid var(--divider-color);
          display: flex;
          flex-direction: column;
          flex: 2 0;
        }

        #container {
          display: flex;
          width: 100%;
          overflow: hidden;
          background: #fff;
        }

        #name {
          font-size: 24px;
          line-height: 28px;
          color: #424242;
          letter-spacing: 0.28px;
          float: left;
        }

        #author {
          display: flex;
          position: relative;
          align-items: center;
          font-size: 14px;
          margin-top: 8px;
          color: var(--secondary-text-color);
        }

        #author span {
          margin: 0 4px;
        }

        #price {
          font-size: 18px;
          color: var(--secondary-text-color);
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        #sales,
        #updated {
          margin-top: 4px;
          font-size: 13px;
          color: var(--secondary-text-color);
        }
      `
    ];
  }

  render() {
    const { data } = this;
    return html`
      <article id="container">
          <header>
            ${
              data.previewMode === "image"
                ? html`<a href="/item/${data.nameInURL}/${data.itemNumber}">
              <ht-image placeholder="${
                window.appConfig.cloudinary.url
              }/image/upload/c_scale,f_auto,w_60/v${data.image.version}/${
                    data.image.public_id
                  }.jpg" image="${
                    window.appConfig.cloudinary.url
                  }/image/upload/c_scale,f_auto,w_1024/v${data.image.version}/${
                    data.image.public_id
                  }.jpg" size="16x9" .altText="${data.name}"></ht-image>
            </a>`
                : ""
            }
            ${
              data.previewMode === "slider"
                ? html`<ht-image-slider .data="${data.slider}" url="${`/item/${
                    data.nameInURL
                  }/${data.itemNumber}`}" .altText="${
                    data.name
                  }"></ht-image-slider>`
                : ""
            }
            ${
              data.previewMode === "animated"
                ? html`<a href="/item/${data.nameInURL}/${
                    data.itemNumber
                  }"><ht-animated-image .data="${
                    data.animated
                  }"></ht-animated-image></a>`
                : ""
            }
            ${
              data.previewMode === "youtube"
                ? html`<ht-elements-item-youtube-preview .data="${
                    data.youtube
                  }" .titleText="${
                    data.name
                  }"></ht-elements-item-youtube-preview>`
                : ""
            }
          </header>
          <section>
          <div id="name-container">
            <a id="name" href="/item/${data.nameInURL}/${data.itemNumber}">${
      data.name
    }</a>
          </div>
            <div id="author">от <ht-user-avatar .data="${
              data.authorData
            }" size="32" verifiedSize="${12}"></ht-user-avatar><a href="/${
      data.authorData.isOrg ? "organization" : "user"
    }/${data.authorData.nameInURL}/${
      data.authorData.isOrg
        ? `${data.authorData.organizationNumber}`
        : `${data.authorData.userNumber}`
    }">${data.authorData.displayName}</a>
    ${
      Object.keys(data.categories).length === 0
        ? null
        : html`<span>|</span>
    <a href="/catalog/${this._getRootCategory(
      data.categories
    ).toLowerCase()}">${this._getRootCategory(data.categories)}
      </a>`
    }
                </div>
          </section>
          <footer>
          <div id="price" style="${
            this._getPrice(data.price) === "Free"
              ? "color:var(--accent-color);"
              : ""
          }">${this._getPrice(data.price)}</div>
          ${
            data.sales !== 0
              ? html`<div id="sales">Продажи: ${data.sales}</div>`
              : null
          }
    <div id="updated">Обновлено: <ht-date .data="${
      data.updated
    }"></ht-date></div>
          <slot name="actions"></slot>
          </footer>
      </article>`;
  }

  static get properties() {
    return {
      data: { type: Object }
    };
  }

  constructor() {
    super();
    this.data = {};
    this.data.authorData = {};
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
  "ht-elements-catalog-list-item-horizontal",
  HTElementsCatalogListItemHorizontal
);
