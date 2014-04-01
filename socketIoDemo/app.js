var express = require('express');
var io = require('socket.io');
var path = require('path');

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);


io.set('log level', 0);

server.listen(3000);

io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });
  
  socket.on('my other event', function (data) {
	  console.log('receiving...');
		console.log(data);
	  console.log('=============');
  });
  
  
  socket.on('buttonPress', function (data) {
	  console.log('receiving2...');
		console.log(data);
	  console.log('=============');
  });
  

	setInterval(function() {
		socket.emit('notifyServer', {
			data: 'serverEventData'
		});
	}, 5000);
  
  
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var routes = require('./routes');
app.get('/', routes.index);