'use strict';
const mongoose = require('mongoose');
const Episode = require('./Episode');

const ShowSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: false
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  episodes: {
    type: [Episode]
  },
  watchedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Show = mongoose.model('Show', ShowSchema);

module.exports = {
  Show
};