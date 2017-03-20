'use strict';

import 'jquery'
import _ from 'underscore'


class Alert {
  constructor(app) {
    this.app = app;
    this.template = _.template(`<div id="<%= alertId %>" class="alert alert-dismissible <%= alertClass %>">
                                <%= content %>
                                </div>`);

    this._alerts = {};
    this._alertsClassMap = {
      'warning': 'alert-warning',
      'danger': 'alert-danger',
      'success': 'alert-success',
      'info': 'alert-info'
    }

  }

  show(key, type, container, content, callback = false) {
    // delete previous
    if (key in this._alerts) {
      this._alerts[key].remove();
      delete this._alerts[key];
    }

    // create new one
    this._alerts[key] = jQuery(this.template({
      alertId: key,
      alertClass: this._alertsClassMap[type],
      content: content
    }));
    jQuery(container).append(this._alerts[key]);

    if (callback) {
      callback();
    }
  }

  hide(key, callback = false) {
    this._alerts[key].fadeOut(700, function () {
      jQuery(this).remove();
      if (callback) {
        callback();
      }
    });
    delete this._alerts[key];
  }
}

export {Alert as default}
