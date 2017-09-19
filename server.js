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
let players = [];

io.on('connection', (socket) => {

  //console.log(socket.handshake);
  console.log('new user connection');

  // user registration
  socket.on('reg', async (data) => {
    console.log(data);
    let usobj = pdb.userObj;

    usobj.email = data.email;
    usobj.pass = data.password;
    usobj.login = 'fc';
    usobj.hash = md5(data.email+data.password);

    console.log(usobj);
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
        console.log('regOk');
      }
    }

  });
  //end reg

  socket.on('auth', async (data) => {
    console.log('socket.on(\'auth\' 0');
    //console.log(data);
    let {login, password} = data;
    console.log(login);
	  console.log(password);
    let hash = md5(login+password);
    console.log(hash);
    let res = await pdb.auth('users', hash);
    console.log('socket.on(\'auth\' 1');
     if(res == false){
       console.log('socket.on(\'auth\' 2');
        socket.emit('authError', { hello: 'error' });

      } else {
        console.log('socket.on(\'auth\' 3');
        if(res.login == 'fc'){
          console.log('socket.on(\'auth\' 4');
          res.login = 'null';
        }
        players.push(new fcon.Player(res.login, socket.id, res._id));
        console.log(players);
        console.log(res.login);
        socket.emit('authOk', {key: res._id, login : res.login});

      }
  });

  socket.on('setNick', async (data) => {
    console.log('on(\'nick\' 0');
    console.log(data);

    let res = await pdb.updatel('users', data);
    console.log('socket.on(\'auth\' 1');

     if(res == false){
       console.log('socket.on(\'auth\' 2');
        socket.emit('errNick', { err: 'error' });
      }

      if(res == true){
        console.log('socket.on(\'auth\' 2');
         socket.emit('setNick', {});
      }

      if(res == 'busy'){
        console.log('socket.on(\'auth\' 2');
         socket.emit('busyNick', { hello: 'error' });
       }

  });

  socket.on("disconnect", function (socket) {
    console.log('disconnect');
  });

 // creat chat
  socket.on('joinchat', function(data){
    //console.log(data);

	  players.push(fchat.setnick(data.nick, socket.id));
  //  console.log('0 ', players);
    socket.join('chat', () => {
      //let rooms = Objects.keys(socket.rooms);
      //console.log(rooms);
      socket.to('chat', 'a new user has joined the room'); // broadcast to everyone in the room
    });
  });

  socket.on('msgChat', function(data){
   //console.log({nick: socket.id, msg: data});
    let log = socket.id;
    //console.log('1 ', {nick: log, msg: data});
   //console.log(log);
    let nick = "";
    nick = players.find((search) => {
    //  console.log('2 ', search);
      return search.id == log});
    //console.log('3 ', nick);

     io.sockets.in('chat').emit('smsgChat', {nick: nick.nick, msg: data.msg});
     console.log({nick: nick.nick, msg: data.msg});
   });

// chat end


//search game

 let queue = [];

 socket.on('searchGame', function(data){
   //console.log(socket);

   queue.push(players.find((search) => {return search.id == socket.id}));
   console.log(queue);
   if(queue.length >= 2){

     socket.join('game', () => {
       console.log('tyts');
       //let rooms = Objects.keys(socket.rooms);
       //console.log(rooms); // [ <socket.id>, 'room 237' ]
       socket.to('chat', 'a new user has joined the room'); // broadcast to everyone in the room
       socket.emit('joiGame', { hello: 'js' });
     });
     console.log(queue[0]);
     console.log(queue[1].id);

     io.sockets.sockets[queue[0].id].emit('joinr', {hu : 'то что нужно'});
   }

 });

 socket.on('joinro', function(data){
   console.log('тут');
     socket.join('game', () => {
       console.log('тут1');
       //let rooms = Objects.keys(socket.rooms);
       //console.log(rooms); // [ <socket.id>, 'room 237' ]
       socket.to('chat', 'a new user has joined the room'); // broadcast to everyone in the room
     });
     console.log('тут2');
     socket.emit('joinGame', { hello: 'jg' });
 });

 socket.on('game', function(data){
   let nick = "";
   nick = players.find((search) => {return search.id == log});
   io.sockets.in('game').emit('gamecoor', {nick: nick.nick, msg: data.msg});
 });

});
