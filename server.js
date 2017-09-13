const io = require('socket.io')({
 transports: ['websocket'],
 pingTimeout: 50 //сколько мс перед отправкой нового пакета ping ( 25000).
});

//let searchsGame = require('searchGame');

io.attach(55555);

let players = [];

io.on('connection', function(socket){

  console.log(socket.handshake);

  socket.on('auth', function(data){
    console.log(data);
    let {login, password} = data;
    console.log(login);
	   console.log(password);
     if(login == 'world2' && password == '12345'){
    /*for(let i=0; i < 500; i++){
      io.sockets.emit('go', { hello: 'hello', is1: i});
      console.log({ hello: 'hello', is1: i});
    }*/
        socket.emit('authOk', { hello: 'hello'});
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
	  let player = {};
	  player.id = socket.id;
	  player.nick = data.nick;
	  players.push(player);
  //  console.log('0 ', players);
    socket.join('chat', () => {
      let rooms = Objects.keys(socket.rooms);
      console.log(rooms);
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
    /*for(let i =0 ;i < players.length; i++){

      if(players[i].id == log){
        nick = players[i].nick;
        break;
	     }
     }
     */
     io.sockets.in('chat').emit('smsgChat', {nick: nick.nick, msg: data.msg});
     console.log({nick: nick.nick, msg: data.msg});
   });

// chat end


//search game

 let queue = [];

 socket.on('searchGame', function(data){
   console.log(players);

   queue.push(players.find((search) => {return search.id == socket.id}));

   if(queue.length >= 2){

     socket.join('game', () => {
       //let rooms = Objects.keys(socket.rooms);
       //console.log(rooms); // [ <socket.id>, 'room 237' ]
       socket.to('chat', 'a new user has joined the room'); // broadcast to everyone in the room
       socket.emit('joinGame', { hello: 'error' });
     });

     io.sockets.socket(queue[0].id).emit('joinr', {});
   }

 });

 socket.on('joinro', function(data){
     socket.join('game', () => {
       //let rooms = Objects.keys(socket.rooms);
       //console.log(rooms); // [ <socket.id>, 'room 237' ]
       socket.to('chat', 'a new user has joined the room'); // broadcast to everyone in the room
     });
     socket.emit('joinGame', { hello: 'error' });
 });

 socket.on('game', function(data){
   let nick = "";
   nick = players.find((search) => {return search.id == log});
   io.sockets.in('game').emit('gamecoor', {nick: nick.nick, msg: data.msg});
 });

});
