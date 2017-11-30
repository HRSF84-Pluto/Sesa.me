const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../..', 'config', 'config.json'))[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
// const db = {};

// OG codebase
const db = new Sequelize('messages', 'root', '38ankeny', {
    dialect: 'mysql'
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});


sequelize.sequelize = sequelize;
sequelize.Sequelize = Sequelize;

module.exports = db;

sequelize.query('CREATE DATABASE IF NOT EXISTS messages')
  .then(() => console.log('Database created'));

const User = sequelize.define('user', {
  //id is already created by default as PK
  username: { type: Sequelize.STRING, unique: true },
  hash: Sequelize.STRING,
  salt: Sequelize.STRING,
  account_type: Sequelize.STRING,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING
});


const Submission = sequelize.define('submission', {
  //id (PK), createdAt, and user id (FK) are created by default
  user_message: Sequelize.TEXT,
  user_contact: Sequelize.TEXT,
  user_urgency: Sequelize.INTEGER,
  admin_response: Sequelize.TEXT,
  //Sequelize Boolean will be converted to TINYINT(1)
  admin_complete: Sequelize.BOOLEAN,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING
});

//define 1:many relationship of Users:Submissions
Submission.belongsTo(User);
User.hasMany(Submission);

//create tables if they do not yet exist
User.sync();
Submission.sync();

exports.User = User;
exports.Submission = Submission;

// This file initialize a sequelize instance
// It contains code that defines models, their relationships, and creates the tables IF they don't already exist in mysql

// try {
//   const config = require('./config.js'); // need to update file path
//   var username = config.USER;
//   var port = config.DB_PORT;
//   var host = config.HOST;
//   var dbUrl = config.DATABASE_URL;
// } catch (err) {
//   var username = process.env.USER;
//   var port = process.env.DB_PORT;
//   var host = process.env.HOST;
//   var dbUrl = process.env.DATABASE_URL;
// }


// if (!global.hasOwnProperty('db')) {
//   var Sequelize = require('sequelize')
//     , db = null

//   if (dbUrl) {
//     // the application is executed on Heroku ... use the postgres database
//     db = new Sequelize(, {
//       dialect:  'postgres',
//       protocol: 'postgres',
//       port:     port,
//       host:     host,
//       logging:  true //false
//     })
//   } else {
//     // the application is executed on the local machine ... use mysql
//     db = new Sequelize('messages', 'root', '', {dialect: 'mysql'});
//   }
// }

const Sequelize = require('sequelize');


//CREDENTIALS FOR THE STAGING DB
//CLEARDB_DATABASE_URL: mysql://badabdf3838c5c:7a09b42d@us-cdbr-iron-east-05.cleardb.net/heroku_0e35bdd032f8e0c?reconnect=true
var username = 'badabdf3838c5c'
var password = '7a09b42d'
var database = 'heroku_0e35bdd032f8e0c'
var host = 'us-cdbr-iron-east-05.cleardb.net'

//// db is named messages
// const db = new Sequelize('messages', 'root', process.env.DBPASSWORD, {
//   dialect: 'mysql'
// });

// db.query('CREATE DATABASE IF NOT EXISTS messages').then(() => console.log('Database created'));

//----------------------------------------------------------------------
// // //DEPLOYMENT DB

// const { Client } = require('pg');

// const db = new Client({
//   connectionString: dbUrl,
//   ssl: true,
// });

// sequelize.connect();

// sequelize.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   // sequelize.end();
// });

//^^^DEPLOPYMENT DB