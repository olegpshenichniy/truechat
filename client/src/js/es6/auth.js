'use strict';

import _ from 'underscore'
import SETTINGS from './settings'
import Utils from './utils'


class Auth {
  constructor(app) {
    this.app = app;

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
    if (!this.app._token) {
      this.app._token = Utils.getCookie(this.app._tokenCookieKey);
    } else {
      Utils.setCookie(this.app._tokenCookieKey, this.app._token, 12);
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
      if (this.app._token) {
        xhr.withCredentials = false;
        xhr.setRequestHeader('Authorization', 'JWT ' + this.app._token);
      }
      xhr.send();
    });
  }

  loginForm() {
    let $this = this;
    let loginForm = jQuery(this.templateLoginForm);
    let loginButton = null;
    let registerButton = null;

    // append html
    loginForm.hide().appendTo(this.app._body).fadeIn();
    loginButton = jQuery('#chat-login-button');
    registerButton = jQuery('#chat-register-button');

    loginButton.click(function () {
      // hide button, show loader
      loginButton.hide();
      $this.app.loader.prepend('login', loginButton.parent());

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
              $this.app._token = data['token'];
              // validate it one more time
              $this.isAuthorized().then(function (data) {
                if (data === true) {
                  $this.app.chat();
                } else {
                  loginButton.show();
                  $this.app.alert.show('auth.isauthorized', 'danger', jQuery('form', loginForm), "Something died!");
                }
              });
            }
            else {
              loginButton.show();
              $this.app.alert.show( 'auth.requesttoken', 'warning', jQuery('form', loginForm), Utils.json2message(data));
            }
          });
        },
        function (err) {
          $this.app.loader.remove('login', function () {
            loginButton.show();
            $this.app.alert.show('auth.requesttoken', 'danger', jQuery('form', loginForm), "Something died!");
          });
        });
    });

    registerButton.click($this.registerForm);
  }

  registerForm() {
    alert('register');
  }

  showWarning() {

  }


}

export {Auth as default}
