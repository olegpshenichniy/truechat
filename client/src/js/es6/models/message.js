'use strict';


class Message {
  constructor(id, datetime, sender, text) {
    this.id = id;
    this.datetime = new Date(datetime);
    this.sender = sender;
    this.text = text;
  }
}

export {Message as default}
