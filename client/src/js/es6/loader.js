'use strict';

import 'jquery'


class Loader {
  constructor() {
    this.globalClass = 'chat-loader-global';
    this.templateGlobal = `<div class="chat-loader chat-loader-global">
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                              <div class="cssload-circle"></div>
                            </div>`;
  }

  showGlobal() {
    jQuery('body').append(this.templateGlobal);
  }

  hideGlobal() {
    jQuery('.' + this.globalClass).fadeOut(3000, function () {
      jQuery(this).remove();
    });
  }
}

export {Loader as default}
