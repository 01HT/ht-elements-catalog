"use strict";
import { LitElement, html } from "@polymer/lit-element";
import "@01ht/ht-image";
import "@01ht/ht-user-avatar";
import "@01ht/ht-image-slider";
import "@01ht/ht-animated-image";

class HTElementsCatalogListItemVertical extends LitElement {
  render() {
    const { data, view } = this;
    return html`
      <style>
        :host {
          display: flex;
          flex-direction:column;
          height: 100%;
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
          padding-bottom: 56.25%;
          max-height: 56.25%;
          position: relative;
        }

        header > * {
          position:absolute;
          top:0;
          left:0;
          right:0;
        }

        section {
          display:flex;
          align-items:center;
          margin-top: 16px;
          
        }

        footer {
          margin-top:16px;
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items:center;
        }

        #container {
          display:flex;
          flex-direction: column;
          width:100%;
          height: 100%;
          overflow:hidden;
        }

        #title {
          display: flex;
          flex-direction:column;
          font-size: 14px;
        }

        #name {
          font-size: 24px;
          line-height: 28px;
          color: #424242;
          letter-spacing: .28px;
        }
        
        #author {
          display:flex;
          margin:4px 0 0 0;
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
            line-height: 40px;
        }

        #donations, #sales {
          margin-top: 4px;
          font-size:12px;
          color: var(--secondary-text-color);
        }

        #price, #sales, #donations {
          line-height: 1;
        }

        #price {
          font-size: 18px;
          color:var(--secondary-text-color);
          font-weight:500;
          text-transform: uppercase;
        }

        #actions {
            align-self:flex-end;
        }

        #slider-container a {
          display:block;
        }

        [hidden] {
          display:none;
        }
      </style>
      <div id="container">
          <header>
            ${
              data.previewMode === "image"
                ? html`<a href="/item/${data.nameInURL}/${data.itemId}">
              <ht-image placeholder=${
                window.cloudinaryURL
              }/image/upload/c_scale,f_auto,w_60/v${data.image.version}/${
                    data.image.public_id
                  }.jpg image=${
                    window.cloudinaryURL
                  }/image/upload/c_scale,f_auto,w_1024/v${data.image.version}/${
                    data.image.public_id
                  }.jpg size="16x9"></ht-image>
            </a>`
                : ""
            }
            ${
              data.previewMode === "slider"
                ? html`<ht-image-slider .data=${data.slider} url=${`/item/${
                    data.nameInURL
                  }/${data.itemId}`}></ht-image-slider>`
                : ""
            }
            ${
              data.previewMode === "animated"
                ? html`<a href="/item/${data.nameInURL}/${
                    data.itemId
                  }"><ht-animated-image .data=${
                    data.animated
                  }></ht-animated-image></a>`
                : ""
            }
            ${
              data.previewMode === "youtube"
                ? html`<ht-elements-item-youtube-preview .data=${
                    data.youtube
                  }></ht-elements-item-youtube-preview>`
                : ""
            }
          </header>
          <section>
         <ht-user-avatar .data=${
           data.authorData
         } size="42" verified-size="16"></ht-user-avatar>
            <div id="title">
              <a id="name" href="/item/${data.nameInURL}/${data.itemId}">${
      data.name
    }</a>
              <div id="author">от <a href="/${
                data.authorData.isOrg ? "organization" : "user"
              }/${data.authorData.uid}">${
      data.authorData.displayName
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
            <div id="sales" ?hidden=${data.sales === 0}>Продажи: ${
      data.sales
    }${view}</div>
            <div id="donations" ?hidden=${
              data.donations === 0 || data.donations === undefined
                ? true
                : false
            }>Поддержка: ${data.donations}$ (${data.donationsAmount})</div>
          </div>
          <div id="actions">
            <slot name="actions"></slot>
          </div>
          </footer>
      </div>
`;
  }

  static get is() {
    return "ht-elements-catalog-list-item-vertical";
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
  HTElementsCatalogListItemVertical.is,
  HTElementsCatalogListItemVertical
);
