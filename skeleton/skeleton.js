var express = require('express');
var path = require('path');
var mainPort=3000;

var app = express()
  , server = require('http').createServer(app)



server.listen(mainPort); console.log('Listening at: http://localhost:'+mainPort);




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var routes = require('./routes');

app.get('/', routes.index);