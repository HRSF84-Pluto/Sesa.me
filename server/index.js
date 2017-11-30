require('dotenv').config();

const express = require('express');

const app = express();
const passport = require('passport')
const session = require('express-session')
const env = require('dotenv').load();
const exphbs = require('express-handlebars')

// blog has models and syncing database in server.js fyi //

// Middleware
const parser = require('body-parser');

// For Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './app/views');
app.engine('hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Router
const router = require('./routes.js');

// Set port
app.set('port', process.env.PORT || 3000);

// Parsing
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

// Routes
app.use('/', router);

// Static Files
app.use(express.static(`${__dirname}/../client/dist`));

// Routes
var authRoute = require('./authroute.js')(app);

// Init server
app.listen(app.get('port'));
console.log('Listening on', app.get('port'));

//Socket

