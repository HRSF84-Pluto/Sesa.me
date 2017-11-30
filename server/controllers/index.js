// This file contains route handlers for the following routes
// /login, /signup, /submissions
// These handlers will utilize instances of sequelize models to query the database directly

const db = require('../db/index.js');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = {
  signup: {
    //creates a new user or finds an already existing user
    //***TODO***: handle incorrect pw but pre-existing user

    post: (req, res) => {
      bcrypt.hash(req.body.hash, 10, (err, hash) => {
        if (err) {
          console.log('Error hashing password ', err);
          res.sendStatus(400);
        }
        sequelize.User.findOrCreate({
          where: {
            username: req.body.username,
            hash: hash,
            salt: req.body.salt,
            account_type: req.body.account_type,
            first_name: req.body.first_name,
            last_name: req.body.last_name
          }
        })
          .spread((user, created) => {
            console.log('User created with', user.get({ plain: true }));
            console.log(user);
            res.sendStatus(created ? 201 : 200);
          })
          .catch((err) => {
            console.log('ERROR creating record with', err);
            res.sendStatus(400);
          });
      });
    },
  },

  login: {
    // authenticate user, verifying username and hashed pw match
    post: (req, res) => {
      sequelize.User.findOne({
        where: {
          username: req.body.username,
        },
      })
        .then((user) => {
          bcrypt.compare(req.body.hash, user.get('hash'), (err, result) => {
            if (result) {
              console.log('Successful authentication with', user.get('username'), user.get('account_type'));
              res.status(201).json({ username: user.get('username'), account_type: user.get('account_type') });
            } else {
              console.log('incorrect login details for ', req.body.username);
              res.sendStatus(400);
            }
          });
        })
        .catch((err) => {
          console.log('Bad request with error:', err);
          res.sendStatus(400);
        });
    }
  },
  submissions: {
    // send a specific user's messages or all messages for an admin
    get: (req, res) => {
      console.log('GET with query', req.query);
      if (req.query.account_type === 'admin') {
        sequelize.Submission.findAll({
          where: {
            admin_complete: null
          }
        })
          .then((allMessages) => {
            console.log('Fetched all msgs for admin with', allMessages);
            res.status(200).json(allMessages);
          })
          .catch((err) => {
            console.log('Error fetching msgs for admin with', err);
            res.sendStatus(404);
          });
      } else {
        sequelize.User.findOne({
          where: {
            username: req.query.username,
          },
        })
          .then((user) => {
            sequelize.Submission.findAll({
              where: {
                //Note: userId is the FK in the submission model that points to a particular user
                userId: user.get('id'),
                // admin_response: {
                //   [Op.not]: null
                // }
              }
            })
              .then((userMessages) => {
                console.log('Fetched all msgs for user with', userMessages);
                res.status(200).json(userMessages);
              })
              .catch((err) => {
                console.log('Error fetching msgs for user with', err);
                res.sendStatus(404);
              });
          });
      }
    },
    // write a message to the db associated with a particular user
    post: (req, res) => {
      if (req.body.account_type !== 'admin') {
        //find user by username
        sequelize.User.findOne({
          where: {
            username: req.body.username
          }
        })
          .then((user) => {
            //create a submission record tied to that particular user
            sequelize.Submission.create({
              userId: user.get('id'),
              user_message: req.body.user_message,
              user_contact: req.body.user_contact,
              user_urgency: req.body.user_urgency,
              first_name: user.get('first_name'),
              last_name: user.get('last_name')
            })
              .then((createdMessage) => {
                console.log('Successful user message creation with', createdMessage);
                res.sendStatus(201);
              })
              .catch((err) => {
                console.log('Error creating user message with', err);
                res.sendStatus(400);
              });
          });
      } else {
        // disallow non-users from sending messages
        console.log('Admins cannot create messages, only amend existing ones');
        res.sendStatus(400);
      }
    },
    // allows an admin to edit most recent submission associated with a user
    patch: (req, res) => {
      console.log('ADMIN PATCH WITH ', req.body);
      // if (req.body.account_type === 'admin') {
      //find message by message id
      sequelize.Submission.findOne({
        where: {
          id: req.body.id,
        }
      })
      //update that message with admin's response
        .then((message) => {
          message.update({
            admin_response: req.body.admin_response || 'Case marked as complete',
            admin_complete: req.body.admin_complete
          })
            .then((updatedMessage) => {
              console.log('Successful message update with', updatedMessage);
              res.sendStatus(201);
            })
            .catch((err) => {
              console.log('Error amending user message with', err);
              res.sendStatus(400);
            });
        });
      // } else {
      //   console.log('Only admins can amend messages');
      //   res.sendStatus(400);
      // }
    }
  }
};
