const io = require('socket.io')({
 transports: ['websocket'],
 pingTimeout: 50 //сколько мс перед отправкой нового пакета ping ( 25000).
});

io.attach(55555);

var players = [];

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
    socket.emit('go', { hello: 'hello'});
  } else {
	  socket.emit('errors', { hello: 'error' });
  }
 });

 socket.on('hi', function(data){
  console.log(data);
  console.log(data.hello);
  let {hello} = data;
  console.log(hello);
  socket.emit('ok', { hello: 'world' });
 });

 socket.on("disconnect", function (socket) {
   console.log('disconnect');
 });

 // creat chat
 socket.on('joinchat', function(data){
	  var player = {};
	  player.id = socket.id;
	  player.nick = data.nick;
	  players.push(player);
	 
   socket.join('chat', () => {
     //let rooms = Objects.keys(socket.rooms);
    // console.log(rooms); // [ <socket.id>, 'room 237' ]
     io.to('chat', 'a new user has joined the room'); // broadcast to everyone in the room
   });
 });

 socket.on('msgChat', function(data){
   //console.log({nick: socket.id, msg: data});
   let log = socket.id;
   console.log({nick: log, msg: data});
   //console.log(log);
   var nick = "";
    for(let i =0 ;i < players.length; i++)
    {
		if(players[i].id == log)
		{
			nick = players[i].nick;
			break;
		}
    }
   io.sockets.in('chat').emit('smsgChat', {nick: nick, msg: data.msg});
 });
// chat end

/*
//search game
 let queue = [id];
 socket.on('searchGame', function(data){
   queue = socket.id;
   if(queue.length = 2){
     socket.join('game', () => {
       let rooms = Objects.keys(socket.rooms);
       console.log(rooms); // [ <socket.id>, 'room 237' ]
       io.to('chat', 'a new user has joined the room'); // broadcast to everyone in the room

     });
   }
 });
 */

});