'use strict';

const update = async (turn, players, io) => {

  setInterval(function() {
    if(turn.length >= 2){
      waitAnswer(turn[0].sid, turn[1].sid, players, io);
      turn.splice(0, 2);
      //turn.splice(0, 1);
    }

    if(turn.length > 0){
      console.log('проверка очереди, в ней '+turn.length+' человек');
    }

    if(players.length == 0) {
      turn = [];
    }
  }, 2000);
}

module.exports = {

}
