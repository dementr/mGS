'use strict';

module.exports = {

  Player : class Player {

    constructor(nick, sid, dbid, email, ts='0') {
      this.nick = nick;
      this.sid = sid;
      this.dbid = dbid;
      this.email = email;
      this.turnStatus = ts;
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
