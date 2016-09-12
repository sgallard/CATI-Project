var express = require('express');
var ip = require('ip');
var app = express();
var path = require('path');
var mysql = require('mysql');
/*var Usuario= require('./models/usuario.js');*/
var models = require("./models/index.js");
var bodyParser = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var fileUpload = require ('express-fileupload');



//Express
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(fileUpload());

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({ secret: 'fiswadsw' ,resave : true,  saveUninitialized: true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./router/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./config/passport')(passport); // pass passport for configuration


var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));



//Routes
app.use('/api', require('./router/api'));

//Start Server
models.sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		var host = ip.address();
		var port = server.address().port;
		console.log('Example app listening at http://%s:%s', host, port);
	});
});

