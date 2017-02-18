'use strict';

import SETTINGS from './settings'
import Utils from './utils'


class Auth {
  constructor() {
  }

  isAuthorized() {
    let token = Utils.getCookie('jwttoken');
    let xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 0) {
          // unsent
        } else if (xhr.readyState === 1) {
          // opened
        } else if (xhr.readyState === 2) {
          // headers_received
        } else if (xhr.readyState === 3) {
          // loading
        } else if (xhr.readyState === 4) {
          // done
          let response = JSON.parse(xhr.responseText);

          if ('is_anonymous' in response) {
            if (response['is_anonymous'] !== true) {
              // callback
              resolve(true);
            }
          }
          // errback
          reject('Wrong response ' + JSON.stringify(response));
        }
      };
      xhr.open('GET', SETTINGS.api.http.stateUrl);

      // set header
      if (token) {
        xhr.withCredentials = false;
        xhr.setRequestHeader('Authorization', 'JWT ' + token);
      }
      xhr.send();
    });
  }


}

export {Auth as default}
