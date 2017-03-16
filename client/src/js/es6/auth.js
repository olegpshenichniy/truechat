'use strict';

import _ from 'underscore'
import SETTINGS from './settings'
import Utils from './utils'


class Auth {
  constructor(app) {
    this.app = app;

    this._loginForm = null;
    this._loginButton = null;
    this._registerButton = null;

    this.templateLoginForm = `<div class="col-lg-4"></div>
                              <div class="col-lg-4">
                                <div class="well bs-component">
                                 <form class="form-horizontal" id="chat-login">
                                   <fieldset>
                                     <legend>Log In</legend>
                                     <div class="form-group">
                                       <div class="col-lg-12">
                                         <input name="username" type="text" class="form-control" placeholder="Username">
                                       </div>
                                     </div>
                                     <div class="form-group">
                                       <div class="col-lg-12">
                                         <input name="password" type="password" class="form-control" placeholder="Password">
                                       </div>
                                     </div>
                                     <div class="form-group">
                                       <div class="col-lg-12">
                                         <button id="chat-login-button" type="button" class="btn btn-success">Go</button>
                                         <button id="chat-register-button" type="button" class="btn btn-default">Register</button>
                                       </div>
                                     </div>
                                   </fieldset>
                                 </form>
                                </div>
                              </div>
                              <div class="col-lg-4"></div>`;

  }

  setupToken() {
    if (!this.app.token) {
      this.app.token = Utils.getCookie(this.app.tokenCookieKey);
    } else {
      Utils.setCookie(this.app.tokenCookieKey, this.app.token, 12);
    }
  }

  requestToken(username, password) {
    let xhr = new XMLHttpRequest();
    let params = jQuery.param({
      username: username,
      password: password
    });

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 0) {
          // unsent
        } else if (xhr.readyState === 1) {
          // opened
        } else if (xhr.readyState === 2) {
          // headers_received
        } else if (xhr.readyState === 3) {
          // loading
        } else if (xhr.readyState === 4) {
          // done
          try {
            let response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (err) {
            reject(err);
          }
        }
      };
      xhr.open('POST', SETTINGS.api.http.tokenGetUrl, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(params);
    });
  }

  isAuthorized() {
    this.setupToken();
    let xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 0) {
          // unsent
        } else if (xhr.readyState === 1) {
          // opened
        } else if (xhr.readyState === 2) {
          // headers_received
        } else if (xhr.readyState === 3) {
          // loading
        } else if (xhr.readyState === 4) {
          // done
          try {
            let response = JSON.parse(xhr.responseText);

            if ('is_anonymous' in response) {
              resolve(!response['is_anonymous']);
            } else if ('detail' in response) {
              if (xhr.status === 403) {
                resolve(false);
              }
            }
            reject('Wrong response ' + JSON.stringify(response));
          } catch (err) {
            reject(err);
          }
        }
      };
      xhr.open('GET', SETTINGS.api.http.stateUrl);
      // set header
      if (this.app.token) {
        xhr.withCredentials = false;
        xhr.setRequestHeader('Authorization', 'JWT ' + this.app.token);
      }
      xhr.send();
    });
  }

  loginForm() {
    let $this = this;

    $this._loginForm = jQuery(this.templateLoginForm);
    $this._loginForm.hide().appendTo(this.app.body).fadeIn();
    $this._loginButton = jQuery('#chat-login-button');
    $this._registerButton = jQuery('#chat-register-button');

    $this._loginButton.click(function () {
      // hide button, show loader
      $this._loginButton.hide();
      $this.app.loader.prepend('login', $this._loginButton.parent());

      // form data
      let formData = jQuery('#chat-login').serializeArray().reduce(function (m, o) {
        m[o.name] = o.value;
        return m;
      }, {});

      // send xhr and handle deffered
      $this.requestToken(formData.username, formData.password).then(
        function (data) {
          $this.app.loader.remove('login', function () {
            // got token
            if ('token' in data) {
              $this.app.token = data['token'];

              $this.isAuthorized().then(function (data) {
                if (data === true) {
                  $this.app._emitter.emit('auth.login.success', data)
                } else {
                  $this._loginButton.show();
                  $this.app.alert.show('auth-isauthorized', 'danger', jQuery('form', $this._loginForm), "Something died!");
                }
              });
            }
            // warnings
            else {
              $this._loginButton.show();
              $this.app._emitter.emit('auth.login.fail', data);
              $this.app.alert.show( 'auth-requesttoken', 'warning', jQuery('form', $this._loginForm), Utils.json2message(data));
            }
          });
        },
        // error
        function (err) {
          $this.app.loader.remove('login', function () {
            $this._loginButton.show();
            $this.app.alert.show('auth-requesttoken', 'danger', jQuery('form', $this._loginForm), "Something died!");
          });
        });
    });

    $this._registerButton.click($this.registerForm);
  }

  remove_LoginForm() {
    if (this._loginForm) {
      this._loginForm.remove();
    }
    this._loginForm = null;
    this._loginButton = null;
    this._registerButton = null;
  }

  registerForm() {
    alert('register');
  }

  remove_registerForm() {}


}

export {Auth as default}
