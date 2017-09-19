'use strict';

module.exports = {

  Player : class Player {

    constructor(nick, sid, key) {
      this.nick = nick;
      this.sid = sid;
      this.hash = key;
    }

    get gnick() {
      //return `${this.nick} ${this.sid}`;
      return this.nick;
    }

    get gid(){
      return this.sid;
    }

    get gkey(){
      return this.key;
    }
  },

}
