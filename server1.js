const io = require('socket.io')({
 transports: ['websocket'],
 pingTimeout: 50 //сколько мс перед отправкой нового пакета ping ( 25000).
});

io.attach(55555);

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
 socket.on('joinchat', function(){
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
   io.sockets.in('chat').emit('smsgChat', {nick: log, msg: data.msg});
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

/*
// Подключаем модуль и ставим на прослушивание 8080-порта - 80й обычно занят под http-сервер
var io = require('socket.io').listen(55555);
// Отключаем вывод полного лога - пригодится в production'е
//io.set('log level', 1);
// Навешиваем обработчик на подключение нового клиента
io.sockets.on('connection', function (socket) {
	// Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
	var ID = (socket.id).toString().substr(0, 5);
	var time = (new Date).toLocaleTimeString();
	// Посылаем клиенту сообщение о том, что он успешно подключился и его имя
	socket.json.send({'event': 'connected', 'name': ID, 'time': time});
	// Посылаем всем остальным пользователям, что подключился новый клиент и его имя
	socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
	// Навешиваем обработчик на входящее сообщение
	socket.on('message', function (msg) {
		var time = (new Date).toLocaleTimeString();
		// Уведомляем клиента, что его сообщение успешно дошло до сервера
		socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
		// Отсылаем сообщение остальным участникам чата
		socket.broadcast.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
	});
	// При отключении клиента - уведомляем остальных
	socket.on('disconnect', function() {
		var time = (new Date).toLocaleTimeString();
		io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
	});
});*/
