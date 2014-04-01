/**
 * Module dependencies.
 */
var express = require('express'),
	path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon('./public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var routes = require('./routes');
console.log(routes);
var user = require('./routes/user');
app.get('/', routes.index);
app.get('/users', user.list2);

var io = require('socket.io'),
	http = require('http');
	
var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

//================================================

var socketChannel = io.listen(server).on('connection', function() {
	console.log('got connection event');
	socketChannel.on('testStringSubmit', function() {
		console.log('received browser event');
	});
});

socketChannel.set('log level', 3);



socketChannel.on('connecting', function () {console.log('connecting');});	
socketChannel.on('anything', function () {console.log('anything');});	

var testStringReceiver = function(socket) {
		console.log('received browser event');
	};
	
setTimeout(function() {
	console.log('init serverEvent');
	socketChannel.sockets.emit('serverEvent', {
		serverEvent: 'serverEventData'
	});
}, 10000);

setInterval(function() {
	console.log('sending serverEvent');
	socketChannel.sockets.emit('serverEvent', {
		serverEvent: 'serverEventData'
	});
}, 5000);

