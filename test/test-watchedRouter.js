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

const generateEpisode = function (bFirstEpisode = false, counter) {
  let episode = {
    id: counter,
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
  let counter = 1;
  seedData.push(generateEpisode(true, 1));
  counter++;
  for(let i = 0; i < 10; i++) {
    seedData.push(generateEpisode(false, counter));
    counter++;
  }

  return Watched.insertMany(seedData);
}

const tearDownDb = () => {
  mongoose.connection.dropDatabase();
}

describe('Watched Router', function() {
  let token;
  let user;
  
  before(function() {
    return runServer(TEST_DATABASE_URL, 3001)
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return chai.request(app)
    .post('/api/users')
    .send({username: 'demo', password: 'password'})
    .then(function(res) {
      token = res.body.token;
      user = res.body.username;
      return seedDb();
    })
  });

  afterEach(function() {
    tearDownDb();
  })

  it('should get a list of shows', function() {
      return chai.request(app)
      .get('/api/watched/watched')
      .set('Authorization', 'bearer ' + token)
    .then(function(res) {
        console.log(res.body);
        expect(res.body).length.to.equal(1);
        expect(res.body).to.be.json;
    })
    .catch(function(err) {
      console.log('not logged in');
    })
  })
  it('should get a list of episodes', function() {
    return chai.request(app)
    .get('/api/watched/episodes?showId=166')
    .set('Authorization', 'bearer ' + token)
    .then(function(res) {
      expect(res.body[0].user).to.equal('demo');
      expect(res.body).to.be.an('array');
    })
  })

  
});