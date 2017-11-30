const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../..', 'config', 'config.json'))[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

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

// exports.User = User;
// exports.Submission = Submission;

db.User = User
db.Submission = Submission

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

//CREDENTIALS FOR THE STAGING DB
//CLEARDB_DATABASE_URL: mysql://badabdf3838c5c:7a09b42d@us-cdbr-iron-east-05.cleardb.net/heroku_0e35bdd032f8e0c?reconnect=true
var username = 'badabdf3838c5c'
var password = '7a09b42d'
var database = 'heroku_0e35bdd032f8e0c'
var host = 'us-cdbr-iron-east-05.cleardb.net'

// fs
//   .readdirSync(__dirname)
//   .filter(function (file) {
//     return (file.indexOf('.') !== 0) && (file !== 'index.js');
//   })
//   .forEach(function (file) {
//     var model = sequelize.import(path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(function (modelName) {
//   if ('associate' in db[modelName]) {
//     db[modelName].associate(db);
//   }
// });
