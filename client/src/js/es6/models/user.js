'use strict';


class User {
  constructor(id, chatName, firstname, lastame, avatar, thumbnail) {
    this.id = id;
    this.chatName = chatName;
    this.firstname = firstname;
    this.lastame = lastame;
    this.avatar = avatar;
    this.thumbnail = thumbnail;
    this.status = null;
  }
}

export {User as default}
