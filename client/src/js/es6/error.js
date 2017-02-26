'use strict';

import 'jquery'


class Error {
  constructor(app) {
    this.app = app;
    this.globalClass = 'chat-error-global';
    this.templateGlobal = `<div class="chat-error-global">
                              <div class="alert alert-dismissible alert-danger">
                                <strong>Crap!</strong> 
                                Server is off, try to reload page in couple of minutes.
                              </div>
                              <div id="source-button" class="btn btn-primary btn-xs" style="display: none;">&lt; &gt;</div>
                            </div>`;
  }

  showGlobal() {
    jQuery(this.app._body).append(this.templateGlobal);
  }

  hideGlobal() {
    jQuery('.' + this.globalClass).fadeOut(3000, function () {
      jQuery(this).remove();
    });
  }
}

export {Error as default}
