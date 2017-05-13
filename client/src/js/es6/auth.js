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

  isAnonymous() {
    return this.app.axios.get(SETTINGS.api.http.stateEndpoint)
      .then(function (response) {
        return response.data.is_anonymous;
      })
      .catch(function (error) {
        throw error;
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
        function (token) {
          $this.app.loader.remove('login', function () {
              $this.app.token = token;
              $this.app._emitter.emit('auth.login.success', formData.username);
              $this.app._setupToken();
          });
        },
        // error
        function (error) {
          $this.app.loader.remove('login', function () {
            $this._loginButton.show();
            $this.app._emitter.emit('auth.login.fail', error);
            $this.app.alert.show('auth-requesttoken', 'warning', jQuery('form', $this._loginForm),
              Utils.json2message(error.response.data)
            );
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
        function (_) {
          $this.app.loader.remove('register', function () {
            alert('created');
          });
        },
        // error
        function (error) {
          $this.app.loader.remove('register', function () {
            $this._registerButton.show();
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

  _requestToken(username, password) {

    let params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return this.app.axios.post(
      SETTINGS.api.http.tokenGetEndpoint,
      params)
      .then(function (response) {
        if ('token' in response.data) {
          return response.data.token
        }
        throw response;
      })
      .catch(function (error) {
        console.log('catch', error.response);
        throw error;
      });

  }

  _logout() {
    Utils.setCookie(this.app.tokenCookieKey, '', -1);
    this.app._emitter.emit('auth.logout.success')
  }

  _register(username, email, password, passwordRepeat) {

    let params = new URLSearchParams();
    params.append('username', username);
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
