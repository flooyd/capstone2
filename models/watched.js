'use strict';
const mongoose = require('mongoose');

const WatchedSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
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
    required: true,
    default: Date.now
  }
});

const Watched = mongoose.model('Watched', WatchedSchema);

module.exports = {
  Watched
};