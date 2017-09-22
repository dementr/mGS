
// обнуляем статус
const changeStatusTurn = (first, second, players, io) => {
  //console.log('мы тут бля');
  //console.log(first, second, players);
  let f = players.findIndex((search) => {return search.sid == first});
  let s = players.findIndex((search) => {return search.sid == second});
  //console.log(f + '< f s >' + s);
  if(f != -1 ){
    players[f].turnStatus = 0;
  }

  if(s != -1 ){
    players[s].turnStatus = 0;
  }
  //console.log('изменили статус');
  //console.log(players);
}

// решаем что делать если ответ был или нет.
const decision = (first, second, players, io) => {
//console.log('сюда попали');
  let f = players.find((search) => {return search.sid == first});
  let s = players.find((search) => {return search.sid == second});
  //console.log(f + '< f s >' + s);
  if(f.turnStatus == 'accepted' && s.turnStatus == 'accepted'){
    //css - character selection screen
    io.sockets.sockets[first].join('gametest', () => {});
    io.sockets.sockets[first].emit('searchGame', { status: 'css'});
    io.sockets.sockets[second].join('gametest', () => {});
    io.sockets.sockets[second].emit('searchGame', { status: 'css'});
  } else {
    changeStatusTurn(first, second, players, io);
    io.sockets.sockets[first].emit('searchGame', { status: 'canceled'});
    io.sockets.sockets[second].emit('searchGame', { status: 'canceled'});
  }
}

// ждем ответа от клиента
const waitAnswer = (first, second, players, io) => {
  //console.log(first+'<first, second>'+second);
  io.sockets.sockets[first].emit('searchGame', { status: 'found'});
  //console.log('тут нет ошибки');
  io.sockets.sockets[second].emit('searchGame', { status: 'found'});
//  console.log('тут нет ошибки 2');
  setTimeout(decision, 10000, first, second, players, io);
//  console.log('тут нет ошибки 3');
}

const turnCheck = async (turn, players, io) => {

  setInterval(function() {
    if(turn.length >= 2){
      waitAnswer(turn[0].sid, turn[1].sid, players, io);
      turn.splice(0, 2);
      //turn.splice(0, 1);
    }

    if(turn.length > 0){
      console.log('проверка очереди, в ней '+turn.length+' человек');
    }
/*
    if(players.length == 0) {
      turn = [];
    }*/
  }, 2000);
}

module.exports = {
  turnCheck,
}
