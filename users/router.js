'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {User} = require('../models/user');
const router = express.Router();
const jsonParser = bodyParser.json();

const {
  checkFieldSize,
  checkNonStringFields,
  checkNonTrimmedFields,
  checkMissingFields
} = require('./registrationMiddleware');

router.use(jsonParser);
const middleware = [checkFieldSize, checkNonStringFields, checkNonTrimmedFields, checkMissingFields];


// Post to register a new user
router.post('/',  middleware, (req, res) => {

  let {username, password} = req.body;

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
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
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
