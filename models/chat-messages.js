class Message {
  constructor(uid, name, message, time) {
    this.uid = uid;
    this.name = name;
    this.message = message;
    this.time = time;
  }
}

class ChatMessages {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  get lastTenMsgs() {
    this.messages = this.messages.slice(-10);
    return this.messages;
  }

  get usersArr() {
    return Object.values(this.users);
  }

  sendMessage(uid, name, message, time) {
    this.messages.push(new Message(uid, name, message, time));
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(uid) {
    delete this.users[uid];
  }
}

module.exports = ChatMessages;