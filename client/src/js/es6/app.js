'use strict';

import Auth from './auth.js'
import Loader from './loader'

class App {
  constructor() {
    this.loader = new Loader();
    this.authorization = new Auth();
  }

  run() {
    let $this = this;

    $this.loader.showGlobal();

    // check if client authorized
    $this.authorization.isAuthorized().then(function (data) {
      $this.loader.hideGlobal();
      setTimeout(function () {
        if (data === true) {
          alert('authorized');
        } else {
          alert('not authorized');
        }
      }, 3000);
    }, function (err) {
      $this.loader.hideGlobal();
      console.log('error', err);
    });

  }
}

export {App as default}
