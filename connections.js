'use strict';

module.exports = {

  Player : class Player {

    constructor(nick, sid, dbid, email) {
      this.nick = nick;
      this.sid = sid;
      this.dbid = dbid;
      this.email = email;
    }

    get gnick() {
      //return `${this.nick} ${this.sid}`;
      return this.nick;
    }

    get gid(){
      return this.sid;
    }

    get gkey(){
      return this.dbid;
    }
  },

}
