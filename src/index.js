/**
 * Import Tool's icon
 */
import { IconWarning } from '@codexteam/icons';

/**
 * Build styles
 */
require('./index.css').toString();

/**
 * @class Warning
 * @classdesc Warning Tool for Editor.js
 * @property {WarningData} data - Warning Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Warning Tool`s input and output data
 * @property {string} title - warning`s title
 * @property {string} message - warning`s message
 *
 * @typedef {object} WarningConfig
 * @description Warning Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in warning`s title input
 * @property {string} messagePlaceholder - placeholder to show in warning`s message input
 */
export default class DomqlDirectCode {
  static DOMQLIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><path d="M30,17.1469762 C22.7235217,18.8081122 17.0638346,18.0431382 13.020939,14.8520542 C13.3375911,14.6386226 13.6544707,14.4191248 13.9722219,14.193096 L14.880722,13.5378499 C15.1984458,13.3111713 15.5088065,13.0929984 15.8124415,12.8831439 C20.397324,16.5246117 24.202813,17.0406935 30,17.1469762 Z M12.9433234,11.003894 C19.4699757,6.43726773 24.9985281,4.98314348 29.5243428,6.69568489 L30,6.87567077 C23.6663291,6.02376237 19.7604498,7.59509247 13.4610159,12.0021461 L12.5630519,12.6372666 C6.03923308,17.1877895 0.0117182515,18.849674 -5.50917623,17.5948151 L-6,17.4832544 C-0.699721992,18.2743969 6.00165134,15.9706747 12.5067346,11.3129462 Z M11.3765197,9.10771019 L11.0219638,9.35728644 C10.1898754,9.93625404 9.35848619,10.4719321 8.53148597,10.9632107 C4.45305756,7.94041617 0.89800993,7.31274926 -6,6.31730593 C1.52460747,5.44375324 7.31678071,6.373888 11.3765197,9.10771019 Z" /></svg>';

  /**
   * Notify core that read-only mode is supported
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get Toolbox settings
   *
   * @public
   * @returns {string}
   */
  static get toolbox() {
    return {
      icon: this.DOMQLIcon,
      title: 'DOMQL Code',
    };
  }

  /**
   * Allow to press Enter inside the Warning
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for warning title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TITLE_PLACEHOLDER() {
    return 'DOMQL code';
  }

  /**
   * Default placeholder for warning message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return 'Message';
  }

  /**
   * Warning Tool`s styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-warning',
      title: 'cdx-warning__title',
      input: this.api.styles.input,
      message: 'cdx-warning__message',
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {WarningData} data — previously saved data
   * @param {WarningConfig} config — user config for Tool
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    this.titlePlaceholder = config.titlePlaceholder || DomqlDirectCode.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder = config.messagePlaceholder || DomqlDirectCode.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      title: data.title || '',
      message: data.message || '',
    };
  }

  /**
   * Create Warning Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const title = this._make('div', [this.CSS.input, this.CSS.title], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.title,
    });
    // const message = this._make('div', [this.CSS.input, this.CSS.message], {
    //   contentEditable: !this.readOnly,
    //   innerHTML: this.data.message,
    // });

    title.dataset.placeholder = this.titlePlaceholder;
    // message.dataset.placeholder = this.messagePlaceholder;

    container.appendChild(title);
    // container.appendChild(message);

    return container;
  }

  /**
   * Extract Warning data from Warning Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
  save(warningElement) {
    const title = warningElement.querySelector(`.${this.CSS.title}`);
    // const message = warningElement.querySelector(`.${this.CSS.message}`);

    return Object.assign(this.data, {
      code: title.innerHTML.replace(/\n/g, ""), // remove line breaks in code string
      // message: message.innerHTML,
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Warning Tool saved data
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      code: {},
    };
  }
}
