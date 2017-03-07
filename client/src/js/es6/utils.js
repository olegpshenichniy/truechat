'use strict';

import _ from 'underscore'


class Utils {
  constructor(app) {
    this.app = app;
  }

  static getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        let cookie = jQuery.trim(cookies[i]);

        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }

    return cookieValue;
  }

  static setCookie(key, value, expireDays) {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + expireDays);
    let c_value = escape(value) + ((expireDays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = key + "=" + c_value;
  }

  static json2message(json) {
    let ul = jQuery('<ul>');

    _.each(Object.keys(json), function (value) {
      let li = jQuery('<li>');
      let innerUl = jQuery('<ul>');
      let key = value.replace(/_/g, ' ');

      li.text(key.charAt(0).toUpperCase() + key.slice(1));
      li.append(innerUl);

      _.each(json[value], function (value) {
        let innerLi = jQuery('<li>');
        innerLi.text(value);
        innerUl.append(innerLi);
      });

      ul.append(li);
    });

    return ul.prop('outerHTML');
  }
}

export {Utils as default}
