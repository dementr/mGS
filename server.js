console.log('Start server');
const io = require('socket.io')({
 transports: ['websocket'],
 //pingTimeout: 50 //сколько мс перед отправкой нового пакета ping ( 25000).
});

io.attach(55555);
#
let searchsGame = require('./searchGame');
let fcon = require('./connections');
let fchat = require('./chat');

let players = [];

io.on('connection', function(socket){

  console.log(socket.handshake);

  socket.on('auth', function(data){
    //console.log(data);
    let {login, password} = data;
    //console.log(login);
	  //console.log(password);
     if(login == 'world2' && password == '12345'){
        socket.emit('authOk', { hello: 'hello'});
        players.push(new fcon.Player('data.nick', socket.id));
        console.log(players);
      } else {
	       socket.emit('errors', { hello: 'error' });
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
