const express = require('express');
// const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
// const crypto = require('crypto');
// const isDevelopment =  app.get('env') === 'development';

/**
 * Database connection
 */
const connection = require('./config/database');
const MongoStore = require('connect-mongo')(session);

const routes = require('./routes');

/**
 * -------------- GENERAL SETUP ----------------
 */

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  },
};

app.use(session(sessionOptions));

/**
 * CORS
 */

app.use(cors());

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

/**
 * -------------- APP LISTEN ----------------
 */

app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
