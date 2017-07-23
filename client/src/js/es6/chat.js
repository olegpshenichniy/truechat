'use strict';

import _ from 'underscore'

import SETTINGS from './settings'
import User from './models/user'
import PrivateThread from './models/private_thread'
import Message from './models/message'


class Chat {
  constructor(app) {
    this.app = app;

    this.wrapper = document.getElementById("chat-wrapper");
    this.chat_box = document.getElementById("chat-box");
    this.current_user_container = document.getElementById("current-user-info");
    this.private_thread_container = document.getElementById("private-threads-list");
    this.chat_text_input = document.getElementById("chat-text-input");
    this.chat_file_input = document.getElementById("chat-file-input");

    this.current_user = null;
    this.users = {};
    this.privateThreads = {};

    this.renderCurrentUser = function (current_user) {
      return `<div class="pull-left image">
                <img src="${current_user.thumbnail}" class="img-circle" alt="User Image">
              </div>
              <div class="pull-left info">
                <p>${current_user.chatName}</p>
                <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
              </div>`
    };

    this.renderPrivateThread = function (thread) {
      let $this = this;
      let interlocutor = null;

      _.each(thread.participants, function (user) {
        if (user.id !== $this.current_user.id) {
          interlocutor = user;
        }
      });

      return `<li id="private_thread_${thread.id}" class="user-to-private-thread">
                <div class="user-panel">
                  <div class="pull-left image">
                    <img src="${interlocutor.thumbnail}" class="img-circle" alt="${interlocutor.chatName} Image">
                  </div>
                  <div class="pull-left thread-info">
                    <p>${interlocutor.chatName}</p>
                    <!--<small><i class="fa fa-circle text-success"></i> Online</small>-->
                  </div>
                </div>
              </li>`
    };

    this.renderMessage = function (message) {

      return `<!-- chat item -->
              <div class="item" id="private_thread_message_${message.id}">
                <img src="${message.sender.thumbnail}" alt="user image" class="online">

                <p class="message">
                  <a href="#" class="name">
                    <small class="text-muted pull-right"><i class="fa fa-clock-o"></i> ${message.datetime}</small>
                    ${message.sender.chatName}
                  </a>
                  ${message.text}
                </p>
              </div>
              <!-- /.item -->`
    };

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

  hookLogout() {
    this.current_user = null;
    this.users = {};
    this.privateThreads = {};

    jQuery(this.current_user_container).html('');
    jQuery(this.private_thread_container).html('');
  }

  sendMessage() {

  }

  _displayCurrentUser() {
    let $this = this;

    // show loader
    $this.app.loader.appendSphere('current-user-info', jQuery($this.current_user_container));

    // load current user info
    $this._loadCurrentUser().then(
      function () {
        // hide loader and render current user info html
        $this.app.loader.removeSphere('current-user-info', function () {
          // place html
          jQuery($this.renderCurrentUser($this.current_user))
            .hide()
            .appendTo(jQuery($this.current_user_container))
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
        $this.app.loader.removeSphere('direct-threads', function () {
          // merge and render threads and users
          $this._renderThreads();
        });
      });
    });

  }

  _displayPrivateThreadMessages(thread) {
    let $this = this;

    $this.app.loader.appendSphere('load-messages', jQuery('#chat-box'));

    $this._loadPrivateThreadMessages(thread).then(function () {
      $this.app.loader.removeSphere('load-messages', function () {
        // enable input and button
        jQuery($this.chat_text_input).removeAttr('disabled');
        jQuery($this.chat_file_input).removeClass('disabled');

        $this._renderMessages(thread);
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
          response.data.current_user.chat_name,
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
            user.chat_name,
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
          $this.privateThreads[privateThread.id] = new PrivateThread(
            privateThread.id,
            privateThread.last_message,
            $this.users[privateThread.initiator],
            [
              $this.users[privateThread.participants[0]],
              $this.users[privateThread.participants[1]]
            ]
          )
        });
      })
      .catch(function (error) {
        throw error;
      });
  }

  _loadPrivateThreadMessages(thread) {
    let $this = this;

    // get direct messages
    return this.app.axios.get(SETTINGS.api.http.privateMessageListCreateEndpoint,
      {
        params: {
          thread: thread.id
        }
      })
      .then(function (response) {
        $this.privateThreads[thread.id].messages = [];

        _.each(response.data, function (message) {
          $this.privateThreads[thread.id].messages.push(
            new Message(
              message.id,
              message.datetime,
              $this.users[message.sender],
              message.text
            )
          )
        });
      })
      .catch(function (error) {
        throw error;
      });
  }

  _renderMessages(thread) {
    let $this = this;

    _.each(thread.messages, function (message) {
      jQuery($this.renderMessage(message))
        .hide()
        .appendTo(jQuery($this.chat_box))
        .fadeIn();
    });

    // add focus
    $this.chat_text_input.focus();

  }

  _renderThreads() {
    let $this = this;
    let threads = [];
    let usersToExclude = new Set();

    // add private threads
    _.each($this.privateThreads, function (thread) {
      // we will exclude this users later
      _.each(thread.participants, function (user) {
        usersToExclude = usersToExclude.add(user.id);
      });

      threads.push(thread);
    });

    // current user as well
    usersToExclude = usersToExclude.add($this.current_user.id);

    // sort private threads by last_message
    threads = _.sortBy(threads, 'lastMessage').reverse();

    // add users (future threads)
    _.each($this.users, function (user) {
      // if we don't have private thread with this user
      if (!usersToExclude.has(user.id)) {
        threads.push(user);
      }
    });

    _.each(threads, function (thread) {

      switch (thread.constructor.name) {
        case 'PrivateThread':
          renderPrivateThread(thread);
          break;
        case 'User':
          // create thread from user and render it
          $this._createPrivateThread(thread).then(function (thread) {
            renderPrivateThread(thread);
          });
          break;
      }
    });

    function renderPrivateThread(thread) {
      // render thread
      jQuery($this.renderPrivateThread(thread))
        .hide()
        .appendTo(jQuery($this.private_thread_container))
        .fadeIn();

      // add onclick handler
      jQuery('#private_thread_' + thread.id).on('click', function () {
        jQuery('.selected-chat').removeClass('selected-chat');
        jQuery(this).addClass('selected-chat');
        jQuery($this.chat_box).html('');
        // load and display messages
        $this._displayPrivateThreadMessages(thread);
      });
    }

  }

  _createPrivateThread(user) {
    let $this = this;
    let params = new URLSearchParams();

    params.append('initiator', this.current_user.id);
    params.append('participants', [user.id]);

    return this.app.axios.post(
      SETTINGS.api.http.privateThreadListCreateEndpoint,
      params)
      .then(function (response) {
        if (response.status === 201) {

          $this.privateThreads[response.data.id] = new PrivateThread(
            response.data.id,
            response.data.last_message,
            $this.users[response.data.initiator],
            [
              $this.users[response.data.participants[0]],
              $this.users[response.data.participants[1]]
            ]
          );

          return $this.privateThreads[response.data.id];

        }
        throw response;
      })
      .catch(function (error) {
        console.log('catch', error.response);
        throw error;
      });
  }

}

export {Chat as default}
