'use strict';

import SETTINGS from './settings'
import Utils from './utils'
import User from './models/user'


class Chat {
  constructor(app) {
    this.app = app;

    this.wrapper = document.getElementById("chat-wrapper");
    this.current_user = null;

    this.renderCurrentUser = function (current_user) {
      return `<div class="pull-left image">
                <img src="${current_user.thumbnail}" class="img-circle" alt="User Image">
              </div>
              <div class="pull-left info">
                <p>${current_user.username}</p>
                <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
              </div>`
    }

  }

  show() {
    let $this = this;
    jQuery(this.wrapper).removeClass('hide').hide().fadeIn(1000, function () {
      $this.displayCurrentUser();
    });
  }

  hide() {
    jQuery(this.wrapper).addClass('hide');
  }

  displayCurrentUser() {
    let $this = this;

    // show loader
    $this.app.loader.appendSphere('current-user-info', jQuery('#current-user-info'));

    // load current user info
    $this._loadCurrentUser().then(
      function () {
        // hide loader and render current user info html
        $this.app.loader.removeSphere('current-user-info', function () {
          $this._showCurrentUser();
        });
      },
      function (err) {
      }
    );
  }

  _showCurrentUser() {
    jQuery(this.renderCurrentUser(this.current_user))
      .hide()
      .appendTo(jQuery('#current-user-info'))
      .fadeIn();
  }

  _loadCurrentUser() {
    let $this = this;

    // get current user info
    return this.app.axios.get(SETTINGS.api.http.stateEndpoint)
      .then(function (response) {
        $this.current_user = new User(
          response.data.current_user.id,
          response.data.current_user.username,
          response.data.current_user.first_name,
          response.data.current_user.last_name,
          response.data.current_user.profile_avatar,
          response.data.current_user.profile_avatar_thumbnail
        )
      })
      .catch(function (error) {
        throw error;
      });
  }



}

export {Chat as default}
