'use strict';

import SETTINGS from './settings'
import Utils from './utils'


class Token {
  constructor(app) {
    this.app = app;
    this.secret = null;
    this.cookieKey = 'truechattoken';
  }

  setup() {
    if (this.secret) {
      // setup/update cookie if token exists
      Utils.setCookie(this.cookieKey, this.secret, 12);
    } else {
      // try to get token from cookie
      this.secret = Utils.getCookie(this.cookieKey);
    }
  }

  remove() {
    this.secret = null;
    Utils.setCookie(this.cookieKey, '', -1);
  }

  verify(token) {
    let params = new URLSearchParams();
    params.append('token', token);

    return this.app.axios.post(
      SETTINGS.api.http.tokenVerifyEndpoint, params)
      .then(function (response) {
        return response.status === 200;
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          return false
        }
        throw error;
      });
  }

  requestSecret(username, password) {
    let params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return this.app.axios.post(
      SETTINGS.api.http.tokenGetEndpoint,
      params)
      .then(function (response) {
        if ('token' in response.data) {
          return response.data.token
        }
        throw response;
      })
      .catch(function (error) {
        console.log('catch', error.response);
        throw error;
      });
  }

}

export {Token as default}
