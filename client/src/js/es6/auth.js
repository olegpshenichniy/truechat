'use strict';

import _ from 'underscore'
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

    this.templateRegistrationForm = `<div class="col-lg-4"></div>
                                      <div class="col-lg-4">
                                        <div class="well bs-component">
                                         <form class="form-horizontal" id="chat-register">
                                           <fieldset>
                                             <legend>Registration</legend>
                                             <div class="form-group">
                                               <div class="col-lg-12">
                                                 <input name="username" type="text" class="form-control" placeholder="Username">
                                               </div>
                                             </div>
                                             <div class="form-group">
                                               <div class="col-lg-12">
                                                 <input name="email" type="text" class="form-control" placeholder="Email">
                                               </div>
                                             </div>
                                             <div class="form-group">
                                               <div class="col-lg-12">
                                                 <input name="password" type="password" class="form-control" placeholder="Password">
                                               </div>
                                             </div>
                                             <div class="form-group">
                                               <div class="col-lg-12">
                                                 <input name="password_repeat" type="password" class="form-control" placeholder="Password repeat">
                                               </div>
                                             </div>
                                             <div class="form-group">
                                               <div class="col-lg-12">
                                                 <button id="chat-register-button" type="button" class="btn btn-success">Go</button>
                                                 <button id="chat-login-button" type="button" class="btn btn-default">Login</button>
                                               </div>
                                             </div>
                                           </fieldset>
                                         </form>
                                        </div>
                                      </div>
                                      <div class="col-lg-4"></div>`;

  }

  isAuthorized() {
    this._setupToken();
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

  show_loginForm() {
    if (this._loginForm) {
      return;
    }

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
      $this._requestToken(formData.username, formData.password).then(
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

    $this._registerButton.click(function () {
      $this.remove_loginForm();
      $this.show_registerForm();
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

  show_logoutLink() {
    let $this = this;

    this._logOutLink.click(function () {
      $this._logout();
    });
    this._logOutLink.show();
  }

  hide_logoutLink() {
    this._logOutLink.hide();
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
      // hide button, show loader
      $this._registerButton.hide();
      $this.app.loader.prepend('register', $this._registerButton.parent());

      // form data
      let formData = jQuery('#chat-register').serializeArray().reduce(function (m, o) {
        m[o.name] = o.value;
        return m;
      }, {});

      // send xhr and handle deffered
      $this._register(formData.username, formData.email, formData.password, formData.password_repeat).then(
        function (data) {

          let respText = data.response;
          let respStatus = data.status;

          console.log(respStatus);

          $this.app.loader.remove('register', function () {
            // created
            if (respStatus === 201) {
              alert('created');
            }
            // warnings
            else {
              $this._registerButton.show();
              $this.app._emitter.emit('auth.register.fail', respText);
              $this.app.alert.show( 'auth-register', 'warning', jQuery('form', $this._registerForm), Utils.json2message(respText));
            }
          });
        },
        // error
        function (err) {
          $this.app.loader.remove('register', function () {
            $this._registerButton.show();
            $this.app.alert.show('auth-register', 'danger', jQuery('form', $this._registerForm), "Something died!");
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

  _setupToken() {
    if (!this.app.token) {
      this.app.token = Utils.getCookie(this.app.tokenCookieKey);
    } else {
      Utils.setCookie(this.app.tokenCookieKey, this.app.token, 12);
    }
  }

  _requestToken(username, password) {
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

  _logout() {
    Utils.setCookie(this.app.tokenCookieKey, '', -1);
    this.app._emitter.emit('auth.logout.success')
  }

  _register(username, email, password, passwordRepeat) {
    let xhr = new XMLHttpRequest();
    let params = jQuery.param({
      username: username,
      email: email,
      password: password,
      password_repeat: passwordRepeat
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
            resolve({response: response, status: xhr.status});
          } catch (err) {
            reject(err);
          }
        }
      };
      xhr.open('POST', SETTINGS.api.http.registrationUrl, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(params);
    });
  }

}

export {Auth as default}
