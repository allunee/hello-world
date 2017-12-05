// =======================
// get the packages we need ============
// =======================
var http = require('http');
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var path    = require('path');

//var session = require('express-session');
//var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
// var User   = require('./app/models/user'); // get our mongoose model

    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 2000; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
app.set('views', (path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//var User   = require('./app/models/user'); // get our mongoose model
// use morgan to log requests to the console
app.use(morgan('dev'));
// app.use(session({
//   // Here we are creating a unique session identifier
//   secret: 'shhhhhhhhh',
//   resave: true,
//   saveUninitialized: true
// }));
// =======================
// routes ================
// =======================
// basic route
// app.get('/', function(req, res) {
//     res.send('Hello! The API is at http://localhost:' + port + '/api');
// });


// API ROUTES -------------------
// we'll get to these in a second
// get an instance of the router for api routes

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
// route to authenticate a user (POST http://localhost:8080/api/authenticate)




// apply the routes to our application with the prefix /api
//app.use(express.static('public'));

//Routes
//app.use('/api', require('./app/controllers/api'));
//app.use('/admin', require('./app/controllers/admin'));
app.use('/', require("./controllers"));
// app.use(express.errorHandler());
// app.use(express.logger({
// 		format:'tiny',
// 		stream:fs.createWriteStream('app.log',{'flagd':'w'})
// 	}));
// app.use(function(req,res){
// 		res.status(400);
// 		res.send('File Not Found');
// 	});

// =======================
// start the server ======
// =======================
var server = http.createServer(app);
// app.listen(port, function(e){
//     console.log(e);
// });

var socketapp = require("./socketapp.js");


server.listen(port, function(){
    console.log('Magic happens at http://localhost:' + port);
    //socketapp.Init(server);    
});



