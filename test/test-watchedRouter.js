const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');

chai.use(chaiHttp);

const {
  app, 
  runServer,
  closeServer
} = require('../server');

const {
  TEST_DATABASE_URL
} = require('../config');

const {Watched} = require('../models/watched.js');

const generateEpisode = function (bFirstEpisode = false) {
  let episode = {
    season: 1,
    number: 1,
    description: 'test',
    title: 'test',
    showId: 166,
    user: 'demo',
    airDate: Date.now(),
    episodeImg: 'abc',
    image: null,
    show: null,
    showDescription: 'BSG desc',
    watchedAt: null
  }

  if (bFirstEpisode) {
    episode.image = "test";
    episode.show = "BSG";
  }

  return episode;
}

const seedDb = () => {
  const seedData = [];
  seedData.push(generateEpisode(true));
  for(let i = 0; i < 10; i++) {
    seedData.push(generateEpisode());
  }

  return Watched.insertMany(seedData);
}

const tearDownDb = () => {
  mongoose.connection.dropDatabase();
}

describe('Watched Router', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3001)
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return seedDb();
  });

  afterEach(function() {
    tearDownDb();
  })

  it('should get a list of shows', function() {
    let res;

    return chai.request(app)
    .post('/api/users')
    .send({username: 'demo', password: 'password'})
    .then(function(_res) {
      console.log(_res);
    })

    return chai.request(app)
    .get('/api/watched/watched')
    .then(function(_res) {
      res = _res;
      expect(res).to.have.status(401);
    })
    .catch(function(err) {
      console.log('not logged in');
    })
  })

  
});