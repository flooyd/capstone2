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
        res.json({"Login Failure": "Incorrect username or password"});
      }
    }); 
}


const jwtStrategy = (req, res, next) => {
  if(req.cookies['jwt']) {
    let decoded = jwt.verify(req.cookies['jwt'], config.JWT_SECRET);
    req.user = decoded.user.username;
  }
  
  next();
}

module.exports = {localStrategy, jwtStrategy };
