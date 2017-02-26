'use strict';

import Auth from './auth.js'
import Loader from './loader'
import Error from './error'

class App {
  constructor() {
    this._body = document.getElementsByTagName("BODY")[0];

    this.loader = new Loader(this);
    this.error = new Error(this);
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
          $this.error.showGlobal();
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
