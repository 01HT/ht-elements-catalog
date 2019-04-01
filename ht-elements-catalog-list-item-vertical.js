"use strict";
import { LitElement, html, css } from "lit-element";
import "@01ht/ht-image";
import "@01ht/ht-user-avatar";
import "@01ht/ht-image-slider";
import "@01ht/ht-animated-image";
import "@01ht/ht-elements-item-youtube-preview";

class HTElementsCatalogListItemVertical extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
        box-sizing: border-box;
      }

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
        margin-right: 16px;
      }

      header {
        padding-bottom: 56.25%;
        max-height: 56.25%;
        position: relative;
      }

      header > * {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }

      section {
        display: flex;
        align-items: center;
        margin-top: 16px;
      }

      footer {
        margin-top: 16px;
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
      }

      #container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #title {
        display: flex;
        flex-direction: column;
        font-size: 14px;
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
        margin: 4px 0 0 0;
        color: var(--secondary-text-color);
      }

      #author a {
        margin-left: 4px;
      }

      #author span {
        margin-left: 4px;
      }

      #info {
        display: flex;
        flex-direction: column;
        line-height: 40px;
      }

      #sales {
        margin-top: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      #price,
      #sales {
        line-height: 1;
      }

      #price {
        font-size: 18px;
        color: var(--secondary-text-color);
        font-weight: 500;
        text-transform: uppercase;
      }

      #actions {
        align-self: flex-end;
      }

      #slider-container a {
        display: block;
      }
    `;
  }

  render() {
    const { data, view } = this;
    return html`
      <div id="container">
          <header>
            ${
              data.previewMode === "image"
                ? html`<a href="/item/${data.nameInURL}/${data.itemNumber}">
              <ht-image placeholder="${
                window.cloudinaryURL
              }/image/upload/c_scale,f_auto,w_60/v${data.image.version}/${
                    data.image.public_id
                  }.jpg" image="${
                    window.cloudinaryURL
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
         <ht-user-avatar .data="${
           data.authorData
         }" size="42" verified-size="16"></ht-user-avatar>
            <div id="title">
              <div id="name-container">
                <a id="name" href="/item/${data.nameInURL}/${
      data.itemNumber
    }">${data.name}</a>
              </div>
              <div id="author">от <a href="/${
                data.authorData.isOrg ? "organization" : "user"
              }/${data.authorData.nameInURL}/${
      data.authorData.isOrg
        ? `${data.authorData.organizationNumber}`
        : `${data.authorData.userNumber}`
    }">${data.authorData.displayName}</a>
    
    ${
      Object.keys(data.categories).length === 0
        ? null
        : html`<span>|</span><a href="/catalog/${this._getRootCategory(
            data.categories
          ).toLowerCase()}">${this._getRootCategory(data.categories)}
    </a>`
    }
    </div>
            </div>
          </section>
          <footer>
          <div id="info">
            <div id="price" style="${
              this._getPrice(data.price) === "Free"
                ? "color:var(--accent-color);"
                : ""
            }">${this._getPrice(data.price)}</div>
            ${
              data.sales !== 0
                ? html`<div id="sales">Продажи: ${data.sales}${view}</div>`
                : null
            }
          </div>
          <div id="actions">
            <slot name="actions"></slot>
          </div>
          </footer>
      </div>
`;
  }

  static get properties() {
    return {
      data: { type: Object },
      view: { type: String }
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
  "ht-elements-catalog-list-item-vertical",
  HTElementsCatalogListItemVertical
);
