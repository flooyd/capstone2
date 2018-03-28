'use strict';
const mongoose = require('mongoose');

const EpisodeSchema = mongoose.Schema({
  title: {
    type: String,
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
    required: true,
    default: Date.now
  }
});

const Episode = mongoose.model('Episode', EpisodeSchema);

module.exports = {
  Episode
};