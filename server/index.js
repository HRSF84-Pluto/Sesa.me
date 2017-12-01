// require('dotenv').config();
const express = require('express');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const parser = require('body-parser');
const env = require('dotenv').load();
const router = require('./routes.js');
const passportLocalSequelize = require('passport-local-sequelize');
const LocalStrategy = require('passport-local').Strategy;


// Set port
app.set('port', process.env.PORT || 3001);

//Socket
const server = require('http').createServer(app)
const io = require('socket.io')(server);

// Parsing
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

server.listen(3001)
console.log('Listening on', app.get('port'));

// Routes
app.use('/', router);


// Passport, Parser, Static Files,
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/../client/dist`));
app.use(require('connect-multiparty')());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Express Router
app.use('/', router);

// Import Models
const models = require('./db/index');

passportLocalSequelize.attachToUser(models.User);

// passport config
passport.use(new LocalStrategy(models.User.authenticate()));
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());

// Set port
// app.set('port', process.env.PORT || 3000);

// Init server
// app.listen(app.get('port'));
// console.log('Listening on', app.get('port'));

//Socket
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('send:message', (msg) => {
    console.log('Message: ', msg)
    io.emit('send:message', {
      username: msg.username,
      message: msg.message
    });
  })
});

// http.listen(3002, function(){
//   console.log('listening on *:3002');
// });

