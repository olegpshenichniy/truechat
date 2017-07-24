'use strict';

import axios from 'axios'
import Emitter from 'event-emitter-es6/dist/event-emitter.min.js'

import SETTINGS from './settings'
import Token from './token.js'
import Auth from './auth.js'
import Loader from './loader'
import Alert from './alert'
import Chat from './chat'


class App {
  constructor() {
    this.state = null; // login, register, chat
    // event emitter
    this._emitter = null;

    this.loader = new Loader(this);
    this.alert = new Alert(this);
    this.token = new Token(this);
    this.auth = new Auth(this);
    this.chat = new Chat(this);

    // body DOM
    this.body = document.getElementsByTagName("BODY")[0];

    // init axios instance
    this.axios = axios.create({
      baseURL: SETTINGS.api.http.baseUrl,
      timeout: 3000
    });
  }

  run() {
    let $this = this;

    // show big app loader
    this.loader.showGlobalSphere();

    // subscribe to all events
    this._subscribeOnEvents();

    // bind keys
    this._addKeypressHandlers();

    // setup token if it exists in cookie
    this.token.setup();

    // verify token
    if (this.token.secret) {
      this.token.verify(this.token.secret).then(
        function (isVerified) {
          console.log('Is token verified:', isVerified);

          $this.loader.removeGlobalSphere(function () {
            if (isVerified) {
              $this._setupAxiosHeaders();
              // chat
              $this.auth.show_logoutLink();
              $this.chat.show();
              $this.state = 'chat';
            } else {
              $this.token.remove();
              // login || register
              $this.auth.show_loginForm();
              $this.state = 'login';
            }
          });
        },
        function (err) {
          $this.loader.removeGlobalSphere(function () {
            $this.alert.show('app-server-off', 'danger', $this.body, `<strong>Crap!</strong>Server died, try later.`);
          });
        });
    } else {
      // login || register
      this.loader.removeGlobalSphere(function () {
        $this.auth.show_loginForm();
        $this.state = 'login';
      });
    }
  }

  _subscribeOnEvents() {
    let $this = this;
    this._emitter = new Emitter();

    // auth.login.success
    this._emitter.on('auth.login.success', function (data) {
      console.info('auth.login.success', data);
      $this._setupAxiosHeaders();
      $this.auth.remove_loginForm();
      $this.auth.show_logoutLink();
      $this.chat.show();
      $this.state = 'chat';
    });

    // auth.login.fail
    this._emitter.on('auth.login.fail', function (data) {
      console.info('auth.login.fail', data);
    });

    // auth.logout.success
    this._emitter.on('auth.logout.success', function () {
      console.info('auth.logout.success');
      $this.hookLogout();
      $this.auth.hookLogout();
      $this.chat.hookLogout();
      $this.state = 'login';
    });
  }

  _addKeypressHandlers() {
    let $this = this;
    jQuery(document).bind('keypress', function (pressed) {
      if (pressed.keyCode === 13) {
        switch ($this.state) {
          case 'login':
            jQuery('#chat-login-button').click();
            break;
          case 'register':
            jQuery('#chat-register-button').click();
            break;
          case 'chat':
            $this.chat.sendMessage();
            break;
        }
      }
    });
  }

  _setupAxiosHeaders() {
    // if we have token let's alter defaults for axios header
    if (!this.token.secret) {
      throw 'NullTokenError'
    }
    Object.assign(this.axios.defaults, {headers: {Authorization: 'JWT ' + this.token.secret}});
  }

  hookLogout() {
    jQuery('aside.control-sidebar').removeClass('control-sidebar-open');
  }

}

export {App as default}
