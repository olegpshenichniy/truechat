'use strict';

import 'jquery'
import Ladda from 'ladda'


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

  showGlobalSphere(callback = false) {
    jQuery(this.app.body).append(this.templateGlobal);

    if (callback) {
      callback();
    }
  }

  removeGlobalSphere(callback = false) {
    jQuery('.' + this.globalClass).fadeOut(2000, function () {
      jQuery(this).remove();

      if (callback) {
        callback();
      }
    });
  }

  appendSphere(key, container, callback = false) {
    this._loaders['sphere-' + key] = jQuery(this.templateLocal);
    container.append(this._loaders['sphere-' + key]);

    if (callback) {
      callback();
    }
  }

  prependSphere(key, container, callback = false) {
    this._loaders['sphere-' + key] = jQuery(this.templateLocal);
    container.prepend(this._loaders['sphere-' + key]);

    if (callback) {
      callback();
    }
  }

  removeSphere(key, callback = false) {
    this._loaders['sphere-' + key].fadeOut(600, function () {
      jQuery(this).remove();

      if (callback) {
        callback();
      }
    });
    delete this._loaders[key];
  }

  animateButton(key, button, callback = false) {
    this._loaders['ladda-' + key] = Ladda.create(button);
    this._loaders['ladda-' + key].start();

    if (callback) {
      callback();
    }
  }

  stopAnimateButton(key, callback = false) {
    let $this = this;
    setTimeout(function () {
      $this._loaders['ladda-' + key].stop();
      delete $this._loaders['ladda-' + key];

      if (callback) {
        callback();
      }
    }, 200);
  }
}

export {Loader as default}
