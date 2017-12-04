const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const models = require('../db/index.js');
const User = models.User;

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

passport.use('local-signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'hash',
  passReqToCallback: true,
},
function(req, username, hash, done) {
  console.log(req.body.location, req.body.long, req.body.lat, 'inside login component');
  User.findOne({
    where: {
      username: username,
    }
  })
    .then((user) => {
      if (user) {
        user.update({
          location: req.body.location,
          lat: req.body.lat,
          long: req.body.long
        })
          .then(() => {
            console.log('Successful location update');
          })
          .catch(() => {
            console.log('Error updating user location');
          });

        // source of login should match the user record's account_type access
        if (user.get('account_type') !== req.body.source) {
          console.log(`user record account_type: ${user.get('account_type')} vs. req body acct_type: ${req.body.source}`)
          return done(null, false, {message: 'Please navigate to correct login page'});
        }

        console.log(`user: ${user.get('username')} account type: ${user.get('account_type')}`);
        bcrypt.compare(hash, user.get('hash'), (err, validPassword) => {
          if (err) { throw new Error('error'); }
          if (validPassword) {
            return done(null, user, {message: 'Success: valid password/credentials'});
          } else {
            return done(null, false, {message: 'Fail: invalid password'});
          }
        });
      } else {
        return done(null, false, {message: 'Fail: username does not exist'});
      }
    })
    .catch(err => done(err, false, {message: 'Fail: username does not exist'}));
}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// //when login is successful
router.post('/',
  passport.authenticate('local-signin'),
  (req, res) => {
    console.log(`${req.user.username} is authenticated: ${req.isAuthenticated()}`);
    // if you have time, try and find the session id on the front end either in req or res;
    res.json(req.user);
  });

module.exports = router;

