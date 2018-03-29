'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const reload = require('reload');
const cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;

const {router: usersRouter} = require('./users/router');
const {router: authRouter} = require('./auth/router');
const {localStrategy, jwtStrategy } = require('./auth/strategies');

const { PORT, DATABASE_URL } = require('./config');
const {User} = require('./models/user');

// Logging
app.use(morgan('common'));
app.use(cookieParser());
app.set('view engine', 'ejs');

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});



app.use(express.static('public'));
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);


app.get('/', jwtStrategy, (req, res) => {
  res.render('pages/search.ejs', {title: 'Capstone 2 - Search'});
});

let server;

function runServer(dbUrl, port) {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development') {
  reload(app);
}


if (require.main === module) {
  runServer(DATABASE_URL, PORT).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
