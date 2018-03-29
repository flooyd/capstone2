'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const {myLocalStrategy} = require('./strategies');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
// The user provides a username and password to login
router.post('/login', myLocalStrategy, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  let options = {
    httpOnly: true
  }
  res.cookie('jwt', authToken, options);
  res.json({"success": req.user.username});
});



// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};