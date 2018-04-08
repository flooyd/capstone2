'use strict';
const mongoose = require('mongoose');

const WatchedSchema = mongoose.Schema({
  id: {
    type: Number
  },
  user: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  episodeImage: {
    type: String
  },
  show: {
    type: String
  },
  airDate: {
    type: Date
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
  showDescription: {
    type: String
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