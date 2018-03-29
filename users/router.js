'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const jsonParser = bodyParser.json();
const formParser = bodyParser.urlencoded({extended: false});

const {
  checkMissingFields,
  checkFieldSize,
  checkNonStringFields,
  checkNonTrimmedFields,
} = require('./registrationMiddleware');

router.use(jsonParser, formParser);
const middleware = [checkMissingFields, checkFieldSize, checkNonStringFields, checkNonTrimmedFields];

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};


// Post to register a new user
router.post('/',  middleware, (req, res) => {

  let {username, password} = req.body;

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        console.log('existing user');
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash
      });
    })
    .then(user => {
      const authToken = createAuthToken(user.serialize());
      let options = {
        httpOnly: true
      }
      res.cookie('jwt', authToken, options);
      res.redirect('/');
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      console.log(err);
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
