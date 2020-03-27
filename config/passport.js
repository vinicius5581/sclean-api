const passport = require('passport');
const fs = require('fs');
const path = require('path');
// Strategies
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// Helpers
const validPassword = require('../lib/passwordUtils').validPassword;
// Models
const User = require('../model/user-model');
// process.env
require('dotenv').config();

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * JWT Strategy
 */

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const jwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const JwtStrategyVerifyCallback = function(jwt_payload, done) {
  console.log(jwt_payload);

  // // We will assign the `sub` property on the JWT to the database ID of user
  // User.findOne({ _id: jwt_payload.sub }, function(err, user) {
  //   // This flow look familiar?  It is the same as when we implemented
  //   // the `passport-local` strategy
  //   if (err) {
  //     return done(err, false);
  //   }
  //   if (user) {
  //     return done(null, user);
  //   } else {
  //     return done(null, false);
  //   }
  // });
  User.findOne({ _id: jwt_payload.sub })
    .then(user => (user ? done(null, user) : done(null, false)))
    .catch(err => done(err, null));
};

passport.use(new JwtStrategy(jwtStrategyOptions, JwtStrategyVerifyCallback));

/**
 * Local Strategy
 */
const localStrategyOptions = {
  usernameField: 'uname',
  passwordField: 'pw',
};

const localStrategyVerifyCallback = (username, password, done) => {
  User.findOne({ 'local.username': username })
    .then(user => {
      if (!user) {
        return done(null, false);
      }
      console.log(user);
      const isValid = validPassword(password, user.local.hash, user.local.salt);
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(err => {
      console.log('err', err);
      done(err);
    });
};

passport.use(
  new LocalStrategy(localStrategyOptions, localStrategyVerifyCallback)
);

/**
 * Google Strategy
 */

const googleStrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/redirect',
};

const googleStrategyVerifyCallback = (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  console.log('google profile: ', profile);
  // check if user already exists in our own db
  User.findOne({ 'google.id': profile.id })
    .then(currentUser => {
      if (currentUser) {
        // already have this user
        console.log('user is: ', currentUser);
        done(null, currentUser);
      } else {
        // if not, create user in our db
        new User({
          'google.id': profile.id,
          'google.displayName': profile.displayName,
          'local.displayName': profile.displayName,
        })
          .save()
          .then(newUser => {
            console.log('created new user: ', newUser);
            done(null, newUser);
          });
      }
    })
    .catch(err => console.log(err));
};
passport.use(
  new GoogleStrategy(googleStrategyOptions, googleStrategyVerifyCallback)
);

/**
 * Facebook Strategy
 */

const facebookStrategyOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/facebook/redirect`,
};

const facebookStrategyVerifyCallback = (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  console.log('facebook profile: ', profile);
  User.findOne({ 'facebook.id': profile.id })
    .then(currentUser => {
      if (currentUser) {
        // already have this user
        done(null, currentUser);
      } else {
        // if not, create user in our db
        new User({
          'facebook.id': profile.id,
          'facebook.displayName': profile.displayName,
          'local.displayName': profile.displayName,
        })
          .save()
          .then(newUser => {
            console.log('created new user: ', newUser);
            done(null, newUser);
          });
      }
    })
    .catch(err => console.log(err));
};

passport.use(
  new FacebookStrategy(facebookStrategyOptions, facebookStrategyVerifyCallback)
);

/**
 * Serializer and Deserializer
 */

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err));
});
