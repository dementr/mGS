
//после каждой функции или переменной нужно ставить запятую.
module.exports = {
  setnick : function(nick, id){
    let player = {};
    player.id = id;
    player.nick = nick;
    return player;
  },

}
