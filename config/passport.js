const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../model/user-model');
const validPassword = require('../lib/passwordUtils').validPassword;

require('dotenv').config();

/**
 * Local Strategy
 */
const localStrategyOptions = {
    usernameField: 'uname',
    passwordField: 'pw'
};

const localStrategyVerifyCallback = (username, password, done) => {
    User.findOne({ username: username })
        .then((user) => {
            if (!user) { 
                return done(null, false) 
            }
            const isValid = validPassword(password, user.hash, user.salt);
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {   
            done(err);
        });
}

passport.use(new LocalStrategy(localStrategyOptions, localStrategyVerifyCallback));


/**
 * Google Strategy
 */

const googleStrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect'
};

const googleStrategyVerifyCallback = (accessToken, refreshToken, profile, done) => {
    console.log('profile: ', profile);
    // check if user already exists in our own db
    User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                googleId: profile.id,
                username: profile.displayName
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    }).catch(err => console.log(err));
}
passport.use(new GoogleStrategy(googleStrategyOptions, googleStrategyVerifyCallback));

/**
 * Facebook Strategy
 */

const facebookStrategyOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://boiling-cliffs-03835.herokuapp.com/auth/facebook/callback"
};

const facebookStrategyVerifyCallback = (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new User({
                facebookId: profile.id,
                username: profile.displayName
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    }).catch(err => console.log(err));
}

passport.use(new FacebookStrategy(facebookStrategyOptions, facebookStrategyVerifyCallback));


/** 
 * Serializer and Deserializer
 */

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});