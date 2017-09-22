console.log('Start server');

const io = require('socket.io')({
 transports: ['websocket'],
 //pingTimeout: 50 //сколько мс перед отправкой нового пакета ping ( 25000).
});

io.attach(55555);

let searchsGame = require('./searchGame');
let fcon = require('./connections');
let fchat = require('./chat');
let md5 = require('md5');
let pdb = require('./db');
//let db = pdb.dbconn; // подключение к бд.
//console.log(pdb);

// all players
let players = [];
// all messages public chat
let messagesChat = [];
// turn on the game
let turn = [];
let waitingStart = [];

io.on('connection', (socket) => {

  let client = {
    id : socket.id,
    nick : ''
  }
  //console.log(socket.handshake);
  console.log('new user connection');

  // user registration
  socket.on('reg', async (data) => {
    //console.log(data);
    let usobj = pdb.userObj;

    usobj.email = data.email;
    usobj.pass = data.password;
    usobj.login = 'fc';
    usobj.hash = md5(data.email+data.password);

    //console.log(usobj);
    let answer = await pdb.singInUser('users', usobj);
    //console.log(answer + 'answer');
    if (answer == 'email'){
      socket.emit('emailError', {});
      console.log('emailError');
    } else {
      if (answer == false){
        socket.emit('regError', {});
        console.log('regError');
      } else {socket.emit('regOk', {});
        console.log('new user registered, email =' + data.email);
      }
    }

  });
  //end reg

  socket.on('auth', async (data) => {
    //console.log('socket.on(\'auth\' 0');
    //console.log(data);
    let {login, password} = data;
    //console.log(login);
	  //console.log(password);
    let hash = md5(login+password);
    //console.log(hash);
    let res = await pdb.auth('users', hash);
    //console.log('socket.on(\'auth\' 1');
     if(res == false){
       //console.log('socket.on(\'auth\' 2');
        socket.emit('authError', { hello: 'error' });

      } else {
        //console.log('socket.on(\'auth\' 3');
        if(res.login == 'fc'){
          console.log('user first connection');
          res.login = 'null';
        } else client.nick = res.login;
        players.push(new fcon.Player(res.login, socket.id, res._id, res.email));
        //console.log(players);
        console.log('user ' +login+ ' authorized');
        //console.log(players[0].gid);
        socket.emit('authOk', {key: res._id, nick : res.login});

        //console.log('tyt 0');
          socket.join('chat', () => {
          //console.log('tyt');
          //globalChatid = Objects.keys(socket.rooms);
        });

        socket.join('countConnections', () => {});
        io.sockets.in('countConnections').emit('countCon', {count: players.length});
      }
  });

  let searchs = (val, id) => {
    let res;
    for(let i=0; i < val.length; i++){
      if(res = (val[i].sid == id)){
        return i;
      }

    }
    if(res == null){
      return false;
    }
  }

// Установка ника
  socket.on('setNick', async (data) => {
    //console.log('setNick 0');
    //console.log(data);
    let id = searchs(players, socket.id);

    let vul = {
      email : players[id].email,
      nick : data.nick
    }

    let res = await pdb.updatel('users', vul);
    //console.log('setNick 1');

     if(res == false){
       //console.log('setNick false');
        socket.emit('setNick', { result: 'error'});
      }

      if(res == true){
        //console.log('setNick ready');
         socket.emit('setNick', { result: 'ready'});
         players[id].nick = data.nick;
         client.nick = data.nick;
         console.log('user ' +players[id].email+ ', set login = '+data.nick);
      }

      if(res == 'busy'){
        //console.log('setNick busy');
         socket.emit('setNick', { result: 'busy'});
       }

  });

  // удаление клиентов из основного массива
  let removePastCon = (val, id) => {
    let res = null;
    for(let i=0; i < val.length; i++){
      if(res = val[i].sid == id){
        console.log('disconnect ' + players[i].nick);
        players.splice(i, 1);
      }

    }
    if(res == null){
      return false;
    }
  }

// удаление подключение из массива при выходе
  socket.on("disconnect", function (socket) {
    //console.log('disconnect '+ client);
    removePastCon(players ,client.id);
    if(players.length > 0){
      io.sockets.in('countConnections').emit('countCon', {count: players.length});
    }

    if(turn.length > 0){
      if(turn.find((search) => {return search.sid == client.id})){
        turn.splice(turn.find((search) => {return search.sid == client.id}), 1);
      }
    }
    client = null;
  });

// отправка смс в общий чат
  socket.on('msgChat', function(data){

     io.sockets.in('chat').emit('msgChat', {nick:client.nick, msg: data.msg});
     messagesChat.push({nick: client.nick, msg: data.msg});
     console.log({nick: client.nick, msg: data.msg});
     console.log(messagesChat.length + '< count msg');
   });

// chat end


//search game

 socket.on('searchGame', function(data){
   //console.log(socket);
   if(data.status == 'start'){
     turn.push(players.find((search) => {return search.sid == socket.id}));
     //console.log(turn);
     if(turn.find((search) => {return search.sid == socket.id})){
       socket.emit('searchGame', { status: 'added'});
     } else socket.emit('searchGame', { status: 'failure'});
   }

   if(data.status == 'stop'){
     turn.splice(turn.find((search) => {return search.sid == socket.id}), 1);
     //console.log(turn);
     socket.emit('searchGame', { status: 'removed'});
   }

   if(data.status == 'accepted'){
     //console.log(players.find((search) => {return search.sid == socket.id;}));
     let id = players.findIndex((search) => {return search.sid == socket.id;});
     console.log(id);
     if(id != -1 ){
       players[id].turnStatus = 'accepted';
     }
   }

});


searchsGame.turnCheck(turn, players, io);
