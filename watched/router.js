'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const User = require('../models/user');
const {Watched} = require('../models/watched');
const {jwtStrategy } = require('../auth/strategies');


router.use(bodyParser.json({limit: '2mb'}));
router.use(bodyParser.urlencoded({extended: false}));
// The user provides a username and password to login

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
  }).sort({showTrackedAt: -1})
  .then(results => {
    res.json(results);
  })
  .catch(err => {
    res.json(err);
  });
});

router.put('/watched', jwtStrategy, (req, res) => {
  let user = req.user;
  let modifiedEpisodes = [];
  let showId = req.body.showId;
  
  req.body.episodesToSave.forEach((e, i) => {
    let query = {
      showId,
      id: e.id,
      user: req.user
    };

    let watchedAt = e.watchedAt;

    Watched.findOneAndUpdate(query, {
      $set: {watchedAt}
    }, {new: true})
    .then(modifiedEpisode => {
      modifiedEpisodes.push(modifiedEpisode);
      if(modifiedEpisodes.length === req.body.episodesToSave.length) {
        res.json(modifiedEpisodes);
      }
    })
  })
});

router.put('/unwatch', jwtStrategy, (req, res) => {
  let unwatchedEpisode = req.body;
  unwatchedEpisode.user = req.user;
  console.log(unwatchedEpisode);

  Watched.findOneAndUpdate(unwatchedEpisode, {
    $set: {watchedAt: null}
  }, {new: true})
  .then(modifiedEpisode => {
    res.json(modifiedEpisode);
  })
  .catch(err => {
    res.json(err);
  });
})

router.delete('/remove', jwtStrategy, (req, res) => {
  let user = req.user;
  let showId = req.body.showId;

  Watched.remove({user, showId})
  .then(result => {
    res.json(result);
  });
});

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
    res.json(createdEps[0])
  })
  .catch(err => {
    res.status(500).json(err);
  })
});

router.get('/episodes', jwtStrategy, (req, res) => {
  console.log(req.query);
  console.log(req.user);
  Watched.find({showId: req.query.showId, user: req.user})
  .then(episodes => {
    if(episodes.count === 0) {
     return res.json({"response": "No saved episodes"});
    }
    return res.json(episodes);
  })
  .catch(err => {
    res.status(500).json(err);
  })
})

module.exports = {router};