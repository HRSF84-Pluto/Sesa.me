var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport, user) {
  const User = user;
  const LocalStrategy = require('passport-local').Strategy;
};

passport.use('local-signup', new LocalStrategy(

  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback

  }, (req, email, password, done) => {
    // hash password
    var generateHash = (password => {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    });

    // store user input data
    // User.findOne({
    //   where: {
    //     email: email
    //   }
    // }).then(function (user) {
    //   if (user) {
    //     return done(null, false, {
    //       message: 'That email is already taken'
    //     });
    //   } else {
    var userPassword = generateHash(password);
    var data =
      {
        password: userPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname
      };

    User.create(data).then(function (newUser, created) {

      if (!newUser) {

        return done(null, false);

      }

      if (newUser) {

        return done(null, newUser);

      }
    });
    //     }
    //   });
    // }
  }));

// module.exports = function (sequelize, Sequelize) {

//     var User = sequelize.define('user', {

//         id: {
//             autoIncrement: true,
//             primaryKey: true,
//             type: Sequelize.INTEGER
//         },

//         firstname: {
//             type: Sequelize.STRING,
//             notEmpty: true
//         },

//         lastname: {
//             type: Sequelize.STRING,
//             notEmpty: true
//         },

//         username: {
//             type: Sequelize.TEXT
//         },

//         about: {
//             type: Sequelize.TEXT
//         },

//         email: {
//             type: Sequelize.STRING,
//             validate: {
//                 isEmail: true
//             }
//         },

//         password: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },

//         last_login: {
//             type: Sequelize.DATE
//         },

//         status: {
//             type: Sequelize.ENUM('active', 'inactive'),
//             defaultValue: 'active'
//         }


//     });

//     return User;

// }
