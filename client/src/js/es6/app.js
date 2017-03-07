'use strict';

import Auth from './auth.js'
import Loader from './loader'
import Alert from './alert'

class App {
  constructor() {
    this._body = document.getElementsByTagName("BODY")[0];
    this._token = null;
    this._tokenCookieKey = 'jwttoken';

    this.loader = new Loader(this);
    this.alert = new Alert(this);
    this.auth = new Auth(this);
  }

  run() {
    let $this = this;

    $this.loader.showGlobal();

    // IS AUTHORISED
    let authDeferred = $this.auth.isAuthorized();
    authDeferred.then(
      function (data) {
        $this.loader.removeGlobal();
        setTimeout(function () {
          if (data === true) {
            // PROCEED TO CHAT
            $this.chat();
          } else {
            // LOGIN || REGISTER
            $this.loginForm();
          }
        }, 3000);
      },
      function (err) {
        $this.loader.removeGlobal();
        setTimeout(function () {
          $this.alert.show(
            'app-run-isauthorized-errback-alert', 'danger', $this._body,
            `<strong>Crap!</strong>Server is off, try to reload page in couple of minutes.`
          );
        }, 3000);
      });
  }

  loginForm() {
    this.auth.loginForm();
  }

  chat() {
    alert('chat');
  }
}

export {App as default}
