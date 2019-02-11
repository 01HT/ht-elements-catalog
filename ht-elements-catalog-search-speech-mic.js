import { LitElement, html, css } from "lit-element";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/paper-icon-button";

class HTElementsCatalogSearchSpeechMic extends LitElement {
  static get styles() {
    return css`
      :host {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        align-content: stretch;
        position: relative;
        width: 40px;
        height: 40px;
      }

      paper-icon-button {
        color: var(--secondary-text-color);
        border-radius: 50%;
      }

      :host([recognizing]) > paper-icon-button {
        color: #fff;
        background-color: #d23f31;
        fill: #fff;
        box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }

      .ring1 {
        display: none;
        position: absolute;
        width: 200%;
        height: 200%;
        border-radius: 100%;
        background-color: rgba(0, 0, 0, 0.1);
      }

      :host([recognizing]) > .ring1 {
        display: block;
        animation: ring1-pulse 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      @keyframes ring1-pulse {
        0% {
          transform: scale(0.5);
        }
        40% {
          transform: scale(0.8);
        }
        100% {
          transform: scale(1);
        }
      }

      .ring2 {
        display: none;
        position: absolute;
        width: 300%;
        height: 300%;
        border-radius: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }

      :host([recognizing]) > .ring2 {
        display: block;
        animation: ring2-pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      @keyframes ring2-pulse {
        0% {
          transform: scale(0.3);
        }
        40% {
          transform: scale(0.5);
        }
        100% {
          transform: scale(1);
        }
      }
    `;
  }

  render() {
    return html`
    <iron-iconset-svg size="24" name="ht-elements-catalog-search-speech-mic">
        <svg>
            <defs>
                <g id="mic">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path>
                </g>
            </defs>
        </svg>
    </iron-iconset-svg>
    <div class="ring1"></div>
    <div class="ring2"></div>
     <paper-icon-button id="clear-toggle" toggles icon="ht-elements-catalog-search-speech-mic:mic" @click="${
       this.toggle
     }" alt="Голосовой ввод"></paper-icon-button>
    `;
  }

  static get properties() {
    return {
      transcript: { type: String },
      completeTranscript: { type: String },
      language: { type: String },
      continuous: { type: Boolean },
      interimResults: { type: Boolean },
      _recognizing: { type: Boolean, attribute: "recognizing", reflect: true }
    };
  }

  constructor() {
    super();
    this.language = window.navigator.language;
  }

  firstUpdated() {
    if (window.webkitSpeechRecognition) {
      this._recognition = new webkitSpeechRecognition();
      this._recognition.continuous = this.continuous;
      this._recognition.interimResults = this.interimResults;
      this._recognition.lang = this.language;
      this._recognition.onstart = this._onStart.bind(this);
      this._recognition.onend = this._onEnd.bind(this);
      this._recognition.onresult = this._onResult.bind(this);
      this._recognition.onerror = this._onError.bind(this);
    } else {
      this.style.display = "none";
    }
  }

  toggle() {
    if (!this._recognition) {
      return;
    }
    if (this._recognizing) {
      this._recognition.stop();
    } else {
      this._recognition.start();
    }
  }

  stop() {
    this._recognition && this._recognition.stop();
  }

  _onStart() {
    this._recognizing = true;
  }

  _onEnd() {
    this._recognizing = false;
    this.dispatchEvent(
      new CustomEvent("result", {
        detail: {
          completeTranscript: this.completeTranscript
        }
      })
    );
  }

  _onResult(e) {
    if (e.results[0].isFinal) {
      this.completeTranscript = e.results[0][0].transcript;
      this.stop();
    }
  }

  _onError(e) {
    console.log(e);
  }
}

customElements.define(
  "ht-elements-catalog-search-speech-mic",
  HTElementsCatalogSearchSpeechMic
);
