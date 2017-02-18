'use strict';

import Auth from './auth.js'
import Loader from './loader'
import Error from './error'

class App {
  constructor() {
    this.loader = new Loader();
    this.authorization = new Auth();
    this.error = new Error();
  }

  run() {
    let $this = this;

    $this.loader.showGlobal();

    // check if client authorized
    $this.authorization.isAuthorized().then(function (data) {
      $this.loader.hideGlobal();
      setTimeout(function () {
        if (data === true) {
          $this.runChat();
        } else {
          $this.showSignInSignUp();
        }
      }, 3000);
    }, function (err) {
      $this.loader.hideGlobal();

      setTimeout(function () {
        $this.error.showGlobal();
      }, 3000);

      console.log('error', err);
    });
  }

  showSignInSignUp() {
    alert('sign in sign up');
  }

  runChat() {
    alert('chat');
  }
}

export {App as default}
