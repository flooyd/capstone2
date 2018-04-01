'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models/user');
const { JWT_SECRET } = require('../config');

const localStrategy = (req, res, next) => {
  let user;
  let {username, password} = req.body;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      req.user = user;
      next();
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        console.log('login error');
        res.status(401).json({"Login Failure": "Incorrect username or password"});
      }
    }); 
}

//not using passport here. Doesn't seem to support storing jwt in cookies...
const jwtStrategy = (req, res, next) => {
  if(req.header('Authorization')) {
    let token = req.header('Authorization').split(' ')[1];
      jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        console.log('decoded', decoded);
        req.user = decoded.user.username;
        next();
      }
      else {
        console.log(err);
        return res.status(401).json({"unauthorized": "must be logged in 1"});
      }
    });
  } else {
    res.status(401).json({"unauthorized": "must be logged in"});
  }
}

module.exports = {localStrategy, jwtStrategy };
