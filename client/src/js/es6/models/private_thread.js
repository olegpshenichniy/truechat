'use strict';


class PrivateThread {
  constructor(id, lastMessage, initiator, participants) {
    this.id = id;
    this.lastMessage = new Date(lastMessage);
    this.initiator = initiator;
    this.participants = participants;
    this.messages = [];
  }
}

export {PrivateThread as default}
