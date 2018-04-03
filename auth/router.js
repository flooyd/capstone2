'use strict';
const express = require('express');
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

const {localStrategy} = require('./strategies');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
// The user provides a username and password to login
router.post('/login', localStrategy, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.status(200).json({"username": req.user.username, "token": authToken});
});



// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};