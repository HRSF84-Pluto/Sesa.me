// const router = require('./routes.js');
// const setupPassport = require('../config/passport/passport.js');
// const LocalStrategy = require('passport-local').Strategy;
// require('dotenv').config();
const express = require('express');
const app = express();
const parser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const passport = require('passport');
const env = require('dotenv').load();
const LocalStrategy = require('passport-local').Strategy;
const sequelize = require('./db/index.js');

// Set port
const PORT = process.env.PORT || 3000;

// USE CREDENTIALS FOR LOCAL MACHINE
// To run locally --> DBSERVER=localhost DBUSER=root DBPASSWORD=38ankeny npm run server-dev
const options = {
  host: process.env.DBSERVER || 'us-cdbr-iron-east-05.cleardb.net',
  port: process.env.PORT,
  user: process.env.DBUSER || 'ba3f260f7ba4c4',
  password: process.env.DBPASSWORD || '0e12068a',
  database: 'messages' || 'heroku_e67b3a46e336139',
  checkExpirationInterval: 1,
  expiration: 1,
};

//USE CREDENTIALS FOR HEROKU STAGING
// const options = {
//   host: 'us-cdbr-iron-east-05.cleardb.net',
//   port: 3306,
//   user: 'ba3f260f7ba4c4',
//   password: '0e12068a',
//   database: 'heroku_e67b3a46e336139',
//   checkExpirationInterval: 60000,
//   expiration: 3600000,
// };

//stores sessions created by passportjs, set your db password above
const sessionStore = new MySQLStore(options);

// express router routes
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const submissionRoute = require('./routes/submissions');
const locationRoute = require('./routes/location');
const userDataRoute = require('./routes/userData');

// middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(parser.json());
app.use(express.static(`${__dirname}/../client/dist`));
app.use(parser.urlencoded({ extended: false }));

//creates session
app.use(session({
  secret: 'secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  // cookie: { maxAge: 3600000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// express router middleware
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/userData', userDataRoute);
// app.use(checkAuthentication);
app.use('/logout', logoutRoute);
app.use('/submissions', submissionRoute);
app.use('/location', locationRoute);


// react router's path
app.get('/**', (req, res) => {
  console.log('This happens when you load a path directly');
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) { //check if it's an authenticated route
    console.log('SERVER INDEX: user that is authenticated', req.user);
    next();
  } else {
    console.log('SERVER INDEX: user is not authenticated');
    next();
    //res.status(401).json({});
  }
}

// Set port
const server = require('http').createServer(app);
app.set('port', process.env.PORT || 3000);

server.listen(PORT);
console.log('Listening on', PORT);

//Socket
const io = require('socket.io')(server);

var users = {};
var rooms = {};
var id = -1;

io.on('connection', function(socket) {
  console.log('a user connected');

  // var hs = socket.handshake;
  // users[hs.session.username] = socket.id;
  // clients[socket.id] = socket;
  socket.on('join:room', (userData) => {
    socket.username = userData.username;
    socket.roomname = userData.roomname;
    socket.join(userData.roomname);
    users[userData.username] = userData.username;
    rooms[userData.roomname] = userData.roomname;
    console.log('Joined the room');

    if (socket.username === 'admin_1') {
      sequelize.User.findOne({
        where: {
          username: socket.username,
        }
      }).then(user => {
        sequelize.Message.findAll({
          userId: user.get('id'),
        }).then(chatHistory => {
          console.log('Successful user message creation with', chatHistory);
          socket.emit('reload:chat', chatHistory);
        }).catch((err) => {
          console.log('Error creating user message with', err);
          res.sendStatus(400);
        });
      });
    }


    var welcomeMessage = {
      id: id++,
      username: '',
      message: `You have connected to room ${userData.roomname}`,
      // content: `You have connected to room ${userData.roomname}`,
    };
    socket.emit('update:chat', welcomeMessage);
    var connectionMessage = {
      id: id++,
      username: '',
      message: userData.username + ' has connected to the room',
      // content: `${userData.username} has connected to the room`,
    };
    socket.broadcast.to(socket.roomname).emit('update:chat', connectionMessage);
  });


  socket.on('send:message', (msg) => {
    console.log('Users: ', users);
    console.log('Rooms: ', rooms);
    console.log('Message: ', msg);
    id = id++;
    sequelize.User.findOne({
      where: {
        username: socket.username,
      }
    }).then(user => {
      sequelize.Message.create({
        userId: user.get('id'),
        message_sender: msg.username,
        message_order: id,
        message_text: msg.message,
      }).then(createdMessage => {
        console.log('Successful user message creation with', createdMessage);
      }).catch((err) => {
        console.log('Error creating user message with', err);
        res.sendStatus(400);
      });
    });

    io.sockets.in(socket.roomname).emit('update:chat', {
      id: id,
      username: msg.username,
      message: msg.message,
      content: `${msg.username}: ${msg.message}`
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.username];
    delete rooms[socket.roomname];
  });
});

//STEP 1: Just get rooms to work between anyone
//get messages in box to scroll within item
//STEP 2: Store messages to each user
//messages will require some order to show up
//messages will have ids
// messages {
//   id:
//   client_id:
//   username:
//   message:
// }

// change the id to match the right number
// be able to retrieve all recorded messages


//STEP 2: Have an admin receive the list of rooms with connections to all of them - any received messages will cause a light up

//Client when signing up will establish a new room to connect to
//this info needs to be sent to the admin for them to be able to find the room
//does the server need to emit messages for everyroom built?
//or can two clients just send messages to each other?

//Will need the message object passed to contain info on which room messages should be sent to
//Will call the roomname for now the username
//
//need an object to show all people who are connected and what they're chatroom ids are?
//all of this information gets sent to the admin
//admin when opening a component will have the credentials to connect to appropriate chat




//react router's path
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

//admin when opening a component will have the credentials to connect to appropriate chat
