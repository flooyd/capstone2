'use strict';
const mongoose = require('mongoose');

const WatchedSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  show: {
    type: String
  },
  showTrackedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  id: {
    type: Number
  },
  showId: {
    type: Number,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  season: {
    type: Number,
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

const Watched = mongoose.model('Watched', WatchedSchema);

module.exports = {
  Watched
};