"use strict";
import { LitElement, html, css } from "lit-element";
import "@01ht/ht-spinner";
import "./ht-elements-catalog-search.js";
import "./ht-elements-catalog-filter.js";
import "./ht-elements-catalog-list.js";
import "./ht-elements-catalog-actions.js";
import "./ht-elements-catalog-selected-filters.js";
import {
  getParametersFromPath,
  getPathFromParameters
} from "./ht-elements-catalog-path-parser.js";
import {
  // callTestHTTPFunction,
  callFirebaseHTTPFunction
} from "@01ht/ht-client-helper-functions";
import { updateMetadata } from "@01ht/ht-client-helper-functions/metadata.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTElementsCatalog extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        ht-elements-catalog-search {
          margin-top: 16px;
          width: 100%;
        }

        #main ht-elements-catalog-filter {
          display: flex;
          position: relative;
          width: 100%;
          min-width: 240px;
        }

        ht-elements-catalog-actions {
          width: 100%;
        }

        ht-elements-catalog-selected-filters {
          margin-top: 32px;
          width: 100%;
        }

        ht-elements-catalog-list {
          width: 100%;
          margin-top: 8px;
        }

        #container {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
        }

        #main {
          display: grid;
          grid-template-columns: 0.3fr 1fr;
          width: 100%;
          margin-top: 32px;
          grid-gap: 32px;
        }

        #list {
          display: flex;
          flex-direction: column;
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          align-items: center;
          align-content: center;
          margin-top: 64px;
        }

        @media screen and (max-width: 1120px) {
          #main {
            grid-gap: 16px;
          }
        }

        @media screen and (max-width: 700px) {
          #main {
            grid-template-columns: 1fr;
            grid-gap: 0;
          }

          #main ht-elements-catalog-filter {
            display: none;
          }
        }

        [hidden] {
          display: none !important;
        }
      `
    ];
  }

  render() {
    const {
      firstLoading,
      loading,
      parameters,
      view,
      cartChangeInProcess
    } = this;
    return html`
      <div id="container">
        <ht-elements-catalog-search .parameters="${parameters}">
          <ht-elements-catalog-filter slot="filter" .parameters="${parameters}"></ht-elements-catalog-filter>
        </ht-elements-catalog-search>
        <div class="spinner-container" ?hidden="${!firstLoading}">
          <ht-spinner></ht-spinner>
        </div>
        <section id="main" ?hidden="${firstLoading}">
          <ht-elements-catalog-filter .parameters="${parameters}"></ht-elements-catalog-filter>
          <section id="list">
            <ht-elements-catalog-actions .view="${view}" .parameters="${parameters}"></ht-elements-catalog-actions>
            <ht-elements-catalog-selected-filters .parameters="${JSON.stringify(
              parameters
            )}"></ht-elements-catalog-selected-filters>
            <ht-elements-catalog-list view="${view}" ?hidden="${loading}" .cartChangeInProcess="${cartChangeInProcess}"></ht-elements-catalog-list>
            <div class="spinner-container" ?hidden="${!loading}">
              <ht-spinner></ht-spinner>
            </div>
          </section>
        </section>
      </div>
`;
  }

  static get properties() {
    return {
      path: { type: String },
      firstLoading: { type: Boolean },
      loading: { type: Boolean },
      parameters: { type: Object },
      view: { type: String },
      cartChangeInProcess: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.parameters = {};
    this.firstLoading = true;
    this.loading = false;
    // view
    let view = localStorage.getItem("catalog-list-view-mode");
    view === null ? (this.view = "grid") : (this.view = view);
  }

  firstUpdated() {
    this.shadowRoot.addEventListener("parameters-changed", e => {
      e.stopPropagation();
      const parameters = e.detail;
      this._updateLocation(parameters);
    });
    this.shadowRoot.addEventListener("view-changed", e => {
      e.stopPropagation();
      const view = e.detail;
      this._changeView(view);
    });
    this.shadowRoot.addEventListener("close-chip", e => {
      e.stopPropagation();
    });
  }

  set path(path) {
    this._setParameters(path);
  }

  get search() {
    return this.shadowRoot.querySelector("ht-elements-catalog-search");
  }

  get filter() {
    return this.shadowRoot.querySelector("#main ht-elements-catalog-filter");
  }

  get filterInSearch() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-search ht-elements-catalog-filter"
    );
  }

  get list() {
    return this.shadowRoot.querySelector("ht-elements-catalog-list");
  }

  get selectedFilters() {
    return this.shadowRoot.querySelector(
      "ht-elements-catalog-selected-filters"
    );
  }

  async _setParameters(path) {
    let parameters = await getParametersFromPath(path);
    this.parameters = parameters;
    this._getItems(parameters);
  }

  async _getItems(parameters) {
    try {
      this.loading = true;
      // test function
      // let data = await callTestHTTPFunction(
      //   "httpsItemsGetCatalogPageDataIndex",
      //   parameters
      // );
      // real function
      // callTestHTTPFunction;
      let data = await callFirebaseHTTPFunction({
        name: "httpsItemsGetCatalogPageDataIndex",
        options: {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(parameters)
        }
      });
      await this._setData(data);
      await this._updateMeta(parameters, data);
      if (this.firstLoading) this.firstLoading = false;
      this.loading = false;
    } catch (error) {
      console.log("_getItems: " + error.message);
    }
  }

  async _updateMeta(parameters, responseData) {
    try {
      let title = "";
      let description = "";
      if (Object.keys(parameters).length === 0 && responseData.count === 0) {
        title = "Готовые курсы и модули для СДО & Онлайн обучение от Elements";
        description =
          "Каталог элементов обучения (электронных курсов, модулей для СДО итп) от независимых разработчиков, для развития вас и пользователей ваших систем.";
      }
      if (responseData.count === 0) {
        title = "Результаты не найдены";
        description = "По данному запросу ничего не найдено.";
      }
      if (responseData.count > 0) {
        description += `Выберите из ${responseData.count} `;
        if (parameters.search) {
          title += `${parameters.search}`;
          description += `${parameters.search}`;
        }
        // add tags
        if (parameters.tags) {
          let tags = parameters.tags;
          if (parameters.search) {
            title += " ";
            description += " ";
          }
          let tagSubstring = "";
          if (parameters.tags.length > 1) {
            tagSubstring = `${tags[0]} и ${tags[1]}`;
          } else {
            tagSubstring = `${tags[0]}`;
          }
          title += tagSubstring;
          description += `${tagSubstring}`;
        }
        // add categories
        if (parameters.categories) {
          let categoriesSubstring = "";
          if (parameters.search || parameters.tags) {
            title += " ";
            description += " ";
          }
          let responseCategories = responseData.filter.categories;

          if (responseCategories.length > 2) {
            categoriesSubstring += `${
              responseCategories[responseCategories.length - 1].name
            } ${responseCategories[1].name}`;
          } else {
            categoriesSubstring += `${responseCategories[1].name}`;
          }
          title += categoriesSubstring;
          description += categoriesSubstring;
        }
        if (title === "") {
          title += `Элементы обучения`;
        }
        if (description === `Выберите из ${responseData.count} `) {
          description += `элементы обучения`;
        }
        // add platform
        if (parameters.platform) {
          title += ` для ${parameters.platform}`;
          description += ` для ${parameters.platform}`;
        }
        // add browsers
        if (parameters.browsers) {
          let browsers = parameters.browsers;
          let browsersSubstring = "";
          if (parameters.platform) browsersSubstring += `,`;
          browsersSubstring += ` совместимые с браузером`;
          if (browsers.length === 1) {
            browsersSubstring += ` ${browsers[browsers.length - 1]}`;
          } else {
            for (let i = 0; i < browsers.length; i++) {
              if (i === browsers.length - 1) {
                browsersSubstring += ` и ${browsers[i]}`;
              } else {
                if (i === 0) {
                  browsersSubstring += ` ${browsers[i]}`;
                } else {
                  browsersSubstring += `, ${browsers[i]}`;
                }
              }
            }
          }
          title += browsersSubstring;
          description += browsersSubstring;
        }
        if (parameters.tools) {
          let tools = parameters.tools;
          let toolsSubstring = "";
          if (parameters.platform) toolsSubstring += `,`;
          toolsSubstring += ` сделанные используя`;
          if (tools.length === 1) {
            toolsSubstring += ` ${tools[tools.length - 1]}`;
          } else {
            for (let i = 0; i < tools.length; i++) {
              if (i === tools.length - 1) {
                toolsSubstring += ` и ${tools[i]}`;
              } else {
                if (i === 0) {
                  toolsSubstring += ` ${tools[i]}`;
                } else {
                  titletoolsSubstring += `, ${tools[i]}`;
                }
              }
            }
          }
          title += toolsSubstring;
          description += toolsSubstring;
        }
        title = title.charAt(0).toUpperCase() + title.slice(1);
        if (title.length < 40) title += " от Elements";
        description += `. Все это создано нашим глобальным сообществом независимых разработчиков.`;
      }

      updateMetadata({
        title: title,
        description: description
      });
    } catch (error) {
      console.log("_updateMeta: " + error.message);
    }
  }

  async _setData(data) {
    try {
      this.list.data = data.items;
      this.filter.data = data.filter;
      this.filterInSearch.data = data.filter;
      this.selectedFilters.data = data;
      this.loading = false;
    } catch (err) {
      console.log("_setData: " + err.message);
    }
  }

  async _updateLocation(parameters) {
    let path = await getPathFromParameters(parameters);
    if (this.path === path) return;
    history.pushState(null, "", path);
    this.dispatchEvent(
      new CustomEvent("change-location", {
        bubbles: true,
        composed: true,
        detail: path
      })
    );
  }

  _changeView(view) {
    localStorage.setItem("catalog-list-view-mode", view);
    this.view = view;
  }

  _showSelectedFilters(parameters) {
    if (Object.keys(parameters).length) return true;
    return false;
  }
}

customElements.define("ht-elements-catalog", HTElementsCatalog);
