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

describe('Views Router', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3001)
  });

  after(function() {
    return closeServer();
  })

  it('/ should send index.html with status 200', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      })
  });
});