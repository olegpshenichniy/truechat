'use strict';

import SETTINGS from './settings'
import Utils from './utils'


class Auth {
  constructor(app) {
    this.app = app;

    this._loginForm = null;
    this._loginButton = null;
    this._registerForm = null;
    this._registerButton = null;
    this._logOutLink = jQuery('#auth-logout');

    this.templateLoginForm = `<div class="login-box">
                                <div class="login-logo">
                                  <b>TRUECHAT</b>
                                </div>
                                <div class="login-box-body">
                                  <p class="login-box-msg">Start your session</p>
                                  <form id="chat-login">
                                    <div class="form-group has-feedback">
                                      <input name="email" type="text" class="form-control" placeholder="Email">
                                      <span class="form-control-feedback"></span>
                                    </div>
                                    <div class="form-group has-feedback">
                                      <input name="password" type="password" class="form-control" placeholder="Password">
                                      <span class="form-control-feedback"></span>
                                    </div>
                                    <div class="row">
                                      <div class="col-xs-6">
                                        <button id="chat-register-button" type="button" class="btn btn-block btn-flat">
                                          Register
                                        </button>
                                      </div>
                                      <div class="col-xs-6">
                                        <button id="chat-login-button" type="button" data-style="zoom-in" class="btn btn-success btn-block btn-flat ladda-button">
                                          <span class="ladda-label">Sign In</span>
                                        </button>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>`;

    this.templateRegistrationForm = `<div class="register-box">
                                <div class="register-logo">
                                  <b>TRUECHAT</b>
                                </div>
                                <div class="login-box-body">
                                  <p class="login-box-msg">Create account</p>
                                  <form id="chat-register">
                                    <div class="form-group has-feedback">
                                      <input name="chat_name" type="text" class="form-control" placeholder="Nickname">
                                      <span class="form-control-feedback"></span>
                                    </div>
                                    <div class="form-group has-feedback">
                                      <input name="email" type="text" class="form-control" placeholder="Email">
                                      <span class="form-control-feedback"></span>
                                    </div>
                                    <div class="form-group has-feedback">
                                      <input name="password" type="password" class="form-control" placeholder="Password">
                                      <span class="form-control-feedback"></span>
                                    </div>
                                    <div class="form-group has-feedback">
                                      <input name="password_repeat" type="password" class="form-control" placeholder="Password repeat">
                                      <span class="form-control-feedback"></span>
                                    </div>
                                    <div class="row">
                                      <div class="col-xs-6">
                                        <button id="chat-login-button" type="button" data-style="zoom-in" class="btn btn-block btn-flat ladda-button">
                                          <span class="ladda-label">Sign In</span>
                                        </button>
                                      </div>
                                      <div class="col-xs-6">
                                        <button id="chat-register-button" type="button" data-style="zoom-in" class="btn btn-success btn-block btn-flat">
                                          Register
                                        </button>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>`;

  }

  show_logoutLink() {
    let $this = this;

    this._logOutLink.click(function () {
      $this._logout();
    });
    this._logOutLink.removeClass('hide');
  }

  hide_logoutLink() {
    this._logOutLink.addClass('hide');
  }

  show_loginForm() {
    if (this._loginForm) {
      return;
    }

    let $this = this;

    $this._loginForm = jQuery(this.templateLoginForm);
    $this._loginForm.hide().appendTo(this.app.body).fadeIn();
    $this._loginButton = jQuery('#chat-login-button');
    $this._registerButton = jQuery('#chat-register-button');

    $this._registerButton.click(function () {
      $this.remove_loginForm();
      $this.show_registerForm();
    });

    $this._loginButton.click(function (e) {
      // show button loader
      $this.app.loader.animateButton('login', this);

      // form data
      let formData = jQuery('#chat-login').serializeArray().reduce(function (m, o) {
        m[o.name] = o.value;
        return m;
      }, {});

      // send xhr and handle deffered
      $this.app.token.requestSecret(formData.email, formData.password).then(
        function (token) {
          // hide button loader and execute callback
          $this.app.loader.stopAnimateButton('login', function () {
            $this.app.token.secret = token;
            $this.app.token.setup();
            $this.app._emitter.emit('auth.login.success', formData.email);
          });
        },
        // error
        function (error) {
          // hide button loader and execute callback
          $this.app.loader.stopAnimateButton('login', function () {
            $this.app._emitter.emit('auth.login.fail', error);
            // show warning message
            $this.app.alert.show('auth-requesttoken', 'warning', jQuery('form', $this._loginForm),
              Utils.json2message(error.response.data)
            );
          });
        });
    });

  }

  remove_loginForm() {
    if (this._loginForm) {
      this._loginForm.remove();
    }
    this._loginForm = null;
    this._loginButton = null;
    this._registerButton = null;
  }

  show_registerForm() {
    if (this._registerForm) {
      return;
    }

    let $this = this;

    $this._registerForm = jQuery(this.templateRegistrationForm);
    $this._registerForm.hide().appendTo(this.app.body).fadeIn();
    $this._loginButton = jQuery('#chat-login-button');
    $this._registerButton = jQuery('#chat-register-button');

    $this._loginButton.click(function () {
      $this.remove_registerForm();
      $this.show_loginForm();
    });

    $this._registerButton.click(function () {
      // show button loader
      $this.app.loader.animateButton('login', this);

      // form data
      let formData = jQuery('#chat-register').serializeArray().reduce(function (m, o) {
        m[o.name] = o.value;
        return m;
      }, {});

      // send xhr and handle deffered
      $this._register(formData.chat_name, formData.email, formData.password, formData.password_repeat).then(
        function (_) {
          $this.app.loader.stopAnimateButton('login', function () {
            alert('created');
          });
        },
        // error
        function (error) {
          $this.app.loader.stopAnimateButton('login', function () {
            $this.app._emitter.emit('auth.register.fail', error);
            $this.app.alert.show('auth-register', 'warning', jQuery('form', $this._registerForm),
              Utils.json2message(error.response.data));
          });
        });
    });
  }

  remove_registerForm() {
    if (this._registerForm) {
      this._registerForm.remove();
    }
    this._loginButton = null;
    this._registerButton = null;
    this._registerForm = null;
  }

  show_sentEmailMessage() {

  }

  remove_sentEmailMessage() {

  }

  _logout() {
    this.app.token.remove();
    this.app._emitter.emit('auth.logout.success')
  }

  _register(chatName, email, password, passwordRepeat) {

    let params = new URLSearchParams();
    params.append('chat_name', chatName);
    params.append('password', password);
    params.append('password_repeat', passwordRepeat);
    params.append('email', email);

    return this.app.axios.post(
      SETTINGS.api.http.registrationEndpoint,
      params)
      .then(function (response) {
        if (response.status === 201) {
          return true;
        }
        throw response;
      })
      .catch(function (error) {
        console.log('catch', error.response);
        throw error;
      });
  }

}

export {Auth as default}
