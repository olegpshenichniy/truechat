'use strict';

import 'jquery'


class Loader {
  constructor(app) {
    this.app = app;
    this.globalClass = 'chat-loader-global';
    this.templateGlobal = `<div class="chat-loader chat-loader-global">
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                            </div>`;
    this.templateLocal = `<div class="chat-loader chat-loader-local">
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                            </div>`;
    this._loaders = {};
  }

  showGlobal(callback = false) {
    jQuery(this.app.body).append(this.templateGlobal);

    if (callback) {
      callback();
    }
  }

  removeGlobal(callback = false) {
    jQuery('.' + this.globalClass).fadeOut(3000, function () {
      jQuery(this).remove();

      if (callback) {
        callback();
      }
    });
  }

  append(key, container, callback = false) {
    this._loaders[key] = jQuery(this.templateLocal);
    jQuery(container).append(this._loaders[key]);

    if (callback) {
      callback();
    }
  }

  prepend(key, container, callback = false) {
    this._loaders[key] = jQuery(this.templateLocal);
    jQuery(container).prepend(this._loaders[key]);

    if (callback) {
      callback();
    }
  }

  remove(key, callback = false) {
    this._loaders[key].fadeOut(900, function () {
      jQuery(this).remove();

      if (callback) {
        callback();
      }
    });
    delete this._loaders[key];
  }
}

export {Loader as default}
