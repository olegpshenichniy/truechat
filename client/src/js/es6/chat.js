'use strict';

import _ from 'underscore'

import SETTINGS from './settings'
import User from './models/user'
import PrivateThread from './models/private_thread'


class Chat {
  constructor(app) {
    this.app = app;

    this.wrapper = document.getElementById("chat-wrapper");
    this.current_user = null;
    this.users = {};
    this.privateThreads = {};

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
      $this._displayCurrentUser();
      $this._displayPrivateThreads();
    });
  }

  hide() {
    jQuery(this.wrapper).addClass('hide');
  }

  hideCurrentUser() {
    jQuery('#current-user-info').html('');
  }

  _displayCurrentUser() {
    let $this = this;

    // show loader
    $this.app.loader.appendSphere('current-user-info', jQuery('#current-user-info'));

    // load current user info
    $this._loadCurrentUser().then(
      function () {
        // hide loader and render current user info html
        $this.app.loader.removeSphere('current-user-info', function () {
          // place html
          jQuery($this.renderCurrentUser($this.current_user))
            .hide()
            .appendTo(jQuery('#current-user-info'))
            .fadeIn();
        });
      },
      function (err) {
      }
    );
  }

  _displayPrivateThreads() {
    let $this = this;

    $this.app.loader.appendSphere('direct-threads', jQuery('#direct-threads'));

    // load users
    $this._loadUsers().then(function () {
      // load private threads
      $this._loadPrivateThreads().then(function () {
        $this.app.loader.removeSphere('direct-threads');

        console.log($this.privateThreads);

      });
    });
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

  _loadUsers() {
    let $this = this;

    // get current user info
    return this.app.axios.get(SETTINGS.api.http.userListEndpoint)
      .then(function (response) {

        _.each(response.data, function (user) {
          $this.users[user.id] = new User(
            user.id,
            user.username,
            user.first_name,
            user.last_name,
            user.profile_avatar,
            user.profile_avatar_thumbnail
          )
        });

      })
      .catch(function (error) {
        throw error;
      });
  }

  _loadPrivateThreads() {
    let $this = this;

    // get current user info
    return this.app.axios.get(SETTINGS.api.http.privateThreadListCreateEndpoint)
      .then(function (response) {
        _.each(response.data, function (privateThread) {
          let participants = {};

          _.each(privateThread.participants, function (participant) {
            participants[participant] = $this.users[participant];
          });

          $this.privateThreads[privateThread.id] = new PrivateThread(
            privateThread.id,
            privateThread.last_message,
            $this.users[privateThread.initiator],
            participants
          )
        });
      })
      .catch(function (error) {
        throw error;
      });
  }

}

export {Chat as default}
