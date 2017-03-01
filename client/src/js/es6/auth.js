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
                                         <button id="chat-login-button" type="button" class="btn btn-default pull-right">Go</button>
                                       </div>
                                     </div>
                                   </fieldset>
                                 </form>
                                </div>
                              </div>
                              <div class="col-lg-4"></div>`;

  }

  setupToken() {
    if (this.app._token === null) {
      this.app._token = Utils.getCookie(this.app._tokenCookieKey);
    } else {
      Utils.setCookie(this.app._tokenCookieKey, this.app._token, 12);
    }
    console.log('Auth.initToken token >>> ', this.app._token);
  }

  getToken(username, password) {
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

            console.log('Auth.isAuthorized response >>> ', response);

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

  showLoginForm() {
    let $this = this;
    let loginForm = jQuery(this.templateLoginForm);
    let loginButton = null;

    // append html
    loginForm.hide().appendTo(this.app._body).fadeIn();
    loginButton = jQuery('#chat-login-button');

    loginButton.click(function () {
      // hide button, show loader
      loginButton.hide();
      $this.app.loader.showLocal('login', loginButton.parent());

      // form data
      let formData = jQuery('#chat-login').serializeArray().reduce(function (m, o) {
        m[o.name] = o.value;
        return m;
      }, {});

      // send xhr and handle deffered
      $this.getToken(formData.username, formData.password).then(
        function (data) {
          $this.app.loader.hideLocal('login', function () {
            console.log('Auth.showLoginForm.getToken.callback >>> ', data);

            // got token
            if ('token' in data) {
              // set token
              $this.app._token = data['token'];

              // validate it one more time
              $this.isAuthorized().then(function (data) {
                if (data === true) {
                  $this.app.runChat();
                } else {
                  loginButton.show();
                  $this.app.alert.show('auth-showloginform-gettoken-alert', 'danger', jQuery('form', loginForm),
                    "Something died!"
                  );
                }
              });

            } else {
              loginButton.show();

              $this.app.alert.show( 'auth-showloginform-gettoken-alert', 'warning', jQuery('form', loginForm),
                Utils.json2message(data)
              );
            }
          });
        },
        function (err) {
          console.log('Auth.showLoginForm.getToken.errback >>> ', err);

          $this.app.loader.hideLocal('login', function () {
            loginButton.show();
            $this.app.alert.show('auth-showloginform-gettoken-alert', 'danger', jQuery('form', loginForm),
              "Something died!"
            );
          });
        });
    });
  }

  showWarning() {

  }


}

export {Auth as default}
