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
    $this.auth.isAuthorized().then(
      function (data) {
        $this.loader.hideGlobal();
        setTimeout(function () {
          if (data === true) {
            $this.runChat();
          } else {
            // LOGIN || REGISTER
            $this.login();
          }
        }, 3000);
      },
      function (err) {
        $this.loader.hideGlobal();

        setTimeout(function () {
          $this.alert.show(
            'app-run-isauthorized-errback-alert',
            'danger',
            $this._body,
            `<strong>Crap!</strong>Server is off, try to reload page in couple of minutes.`
          );
        }, 3000);

        console.log('App.run.isAuthorized.errback >>> ', err);
      });
  }

  login() {
    this.auth.showLoginForm();
  }

  runChat() {
    alert('chat');
  }
}

export {App as default}
