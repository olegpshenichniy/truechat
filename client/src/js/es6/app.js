'use strict';

import Emitter from 'event-emitter-es6/dist/event-emitter.min.js'

import Auth from './auth.js'
import Loader from './loader'
import Alert from './alert'

class App {
  constructor() {
    this._emitter = null;
    this.token = null;
    this.tokenCookieKey = 'jwttoken';
    this.body = document.getElementsByTagName("BODY")[0];
    this.loader = new Loader(this);
    this.alert = new Alert(this);
    this.auth = new Auth(this);

    this._subscribeOnEvents();
  }

  run() {
    this.auth.hide_logoutLink();
    this.loader.showGlobal();
    this._auth();
  }

  _subscribeOnEvents() {
    let $this = this;
    this._emitter = new Emitter();

    this._emitter.on('auth.login.success', function (data) {
      console.info('auth.login.success', data);
      $this.auth.remove_loginForm();
      $this.auth.show_logoutLink();
    });

    this._emitter.on('auth.login.fail', function (data) {
      console.info('auth.login.fail', data);
    });

    this._emitter.on('auth.logout.success', function () {
      console.info('auth.logout.success');
      $this.auth.hide_logoutLink();
      $this.auth.show_loginForm();
    });
  }

  _auth() {
    let $this = this;

    $this.auth.isAuthorized().then(
      function (data) {
        $this.loader.removeGlobal();

        setTimeout(function () {
          if (data === true) {
            // chat
            $this.auth.show_logoutLink();
            $this._chat();
          } else {
            // login || register
            $this._loginForm();
          }
        }, 3000);
      },
      function (err) {
        $this.loader.removeGlobal();

        setTimeout(function () {
          $this.alert.show('app-server-off', 'danger', $this.body, `<strong>Crap!</strong>Server died, try later.`);
        }, 3000);
      });
  }

  _loginForm() {
    this.auth.show_loginForm();
  }

  _chat() {
  }
}

export {App as default}
