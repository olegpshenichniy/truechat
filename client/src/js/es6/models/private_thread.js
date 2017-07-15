'use strict';


class PrivateThread {
  constructor(id, lastMessage, initiator, participants) {
    this.id = id;
    this.lastMessage = new Date(lastMessage);
    this.initiator = initiator;
    this.participants = participants;
  }
}

export {PrivateThread as default}
