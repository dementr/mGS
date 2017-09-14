'use strict';

module.exports = {

  Player : class Player {

    constructor(nick, sid) {
      this.nick = nick;
      this.sid = sid;
    }

    get gnick() {
      //return `${this.nick} ${this.sid}`;
      return this.nick;
    }

    get gid(){
      return this.sid;
    }
  },

}
