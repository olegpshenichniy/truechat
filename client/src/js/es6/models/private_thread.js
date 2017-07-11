'use strict';


class PrivateThread {
  constructor(id, lastMessage, initiator, participants) {
    this.id = id;
    this.lastMessage = lastMessage;
    this.initiator = initiator;
    this.participants = participants;
  }
}

export {PrivateThread as default}
