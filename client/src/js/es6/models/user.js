'use strict';


class User {
  constructor(id, username, firstname, lastame, avatar, thumbnail) {
    this.id = id;
    this.username = username;
    this.firstname = firstname;
    this.lastame = lastame;
    this.avatar = avatar;
    this.thumbnail = thumbnail;
  }
}

export {User as default}
