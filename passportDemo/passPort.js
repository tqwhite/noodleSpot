"user strict"

var mainPort = 3000;

var express = require('express');
var path = require('path');
var querystring = require('querystring');
var passport = require('passport');

var routes = require('./routes');
var user = require('./models/user.js');
var User = new user();

//====================================================
	
var app = express(),
	server = require('http').createServer(app)
	server.listen(mainPort);
	
console.log('Listening at: http://localhost:' + mainPort);

//====================================================

app.use(function processPost(request, response, callback) {
	var queryData = "";
	request.on('data', function(data) {
		queryData += data;
		if (queryData.length > 1e6) {
			queryData = "";
			response.writeHead(413, {
				'Content-Type': 'text/plain'
			}).end();
			request.connection.destroy();
		}
	});
	request.on('end', function() {
		request.body = querystring.parse(queryData);
		callback();
	});
});

app.use(passport.initialize());
app.use( express.cookieParser() );
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.session());

//====================================================
var LocalStrategy = require('passport-local').Strategy;
	
passport.use(new LocalStrategy(
	function checkLoginParms(proposedUsername, proposedPassword, passportFinalCallback) {
		var doAuthentication = function(err, user) {
			if (err) {
				return passportFinalCallback(err);
			}
			if (!user) {
				return passportFinalCallback(null, false, {
					message: 'Incorrect username.'
				});
			}
			if (!user.validPassword(proposedPassword)) {
				return passportFinalCallback(null, false, {
					message: 'Incorrect password.'
				});
			}
			return passportFinalCallback(null, user);
		};
    	
		User.findOne(
			{username: proposedUsername}, 
			doAuthentication
		);
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});
passport.deserializeUser(function(id, done) {
	console.log('\n==============  '+ __filename.replace(__dirname,'') +'   (at: passport.deserializeUser)  =========================\n');
	done(null, 'juancito');
});


//====================================================


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/login', routes.login);
app.post('/login', passport.authenticate('local'), function(req, res) {
	console.log('successful login');
	// If this function gets called, authentication was successful.
	// `req.user` contains the authenticated user.
	res.redirect('/');
	//   res.redirect('/users/' + req.user.username);
});

//app.get('/', routes.index);
app.get('/', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.redirect('/login');
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			return res.redirect('/users/' + user.username);
		});
	})(req, res, next);
});