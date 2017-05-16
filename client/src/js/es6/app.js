'use strict';

import axios from 'axios'
import Emitter from 'event-emitter-es6/dist/event-emitter.min.js'

import SETTINGS from './settings'
import Auth from './auth.js'
import Loader from './loader'
import Alert from './alert'
import Utils from './utils'


class App {
  constructor() {
    // event emitter
    this._emitter = null;

    // token
    this.token = null;
    this.tokenCookieKey = 'truechattoken';

    this.loader = new Loader(this);
    this.alert = new Alert(this);
    this.auth = new Auth(this);

    // body DOM
    this.body = document.getElementsByTagName("BODY")[0];
    this.chat_wrapper = document.getElementById("chat-wrapper");

    // init axios instance
    this.axios = axios.create({
      baseURL: SETTINGS.api.http.baseUrl,
      timeout: 3000
    });
  }

  run() {
    this._subscribeOnEvents();
    this._setupToken();
    this.loader.showGlobalSphere();
    // main state
    this._auth();
  }

  _setupToken() {
    let $this = this;

    if (this.token) {
      // setup/update cookie if token exists
      Utils.setCookie($this.tokenCookieKey, $this.token, 12);
    } else {
      // try to get token from cookie mmm tasty
      $this.token = Utils.getCookie($this.tokenCookieKey);
    }

    // if we have token let's alter defaults for axios header
    if ($this.token) {
      $this.token = Utils.getCookie($this.tokenCookieKey);
      Object.assign(this.axios.defaults, {headers: {Authorization: 'JWT ' + this.token}});
    }

  }

  _subscribeOnEvents() {
    let $this = this;
    this._emitter = new Emitter();

    this._emitter.on('auth.login.success', function (data) {
      console.info('auth.login.success', data);

      $this.auth.remove_loginForm();
      $this.auth.show_logoutLink();
      $this.show_chat();
    });

    this._emitter.on('auth.login.fail', function (data) {
      console.info('auth.login.fail', data);
    });

    this._emitter.on('auth.logout.success', function () {
      console.info('auth.logout.success');

      $this.hide_chat();
      $this.auth.hide_logoutLink();
      $this.auth.show_loginForm();
    });
  }

  _auth() {
    let $this = this;

    $this.auth.isAnonymous().then(
      function (isAnonymous) {
        $this.loader.removeGlobalSphere(function () {
          if (isAnonymous === true) {
            // login || register
            $this.auth.show_loginForm();
          } else {
            // chat
            $this.auth.show_logoutLink();
            $this.show_chat();
          }
        });
      },
      function (err) {
        $this.loader.removeGlobalSphere(function () {
          $this.alert.show('app-server-off', 'danger', $this.body, `<strong>Crap!</strong>Server died, try later.`);
        });
      });
  }

  show_chat() {
    jQuery(this.chat_wrapper).removeClass('hide').hide().fadeIn(1000);
  }

  hide_chat() {
    jQuery(this.chat_wrapper).addClass('hide');
  }

}

export {App as default}
