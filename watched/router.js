'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/user');
const {Watched} = require('../models/watched');
const {jwtStrategy } = require('../auth/strategies');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));
// The user provides a username and password to login

//saves all episodes, marks none
router.get('/watched', jwtStrategy, (req, res) => {
  let user = req.user;
  
  Watched.find({
    user,
    image: {
      $ne: null
    },
    show: {
      $ne: null
    }
  })
  .then(results => {
    res.json(results);
  })
  .catch(err => {
    res.json(err);
  })
})
router.post('/watching', jwtStrategy, (req, res) => {
  let episode = req.body[0];
  episode.user = req.user;
  
  Watched.findOne({showId: episode.showId, user: req.user}).count()
  .then(count => {
    console.log(count);
    if(count > 0) {
      return Promise.reject({
        message: 'You are already watching this show'
      });
    } else {
      return Watched.insertMany(req.body);
    }
  })
  .then(createdEps => {
    res.json(createdEps)
  })
  .catch(err => {
    res.status(500).json(err);
  })
});

module.exports = {router};