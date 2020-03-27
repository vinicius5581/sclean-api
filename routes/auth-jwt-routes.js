const mongoose = require('mongoose');
const router = require('express').Router();
// const User = mongoose.model('User');
const User = require('../model/user-model');
const passport = require('passport');
const jwtUtils = require('../lib/jwtUtils');
const passwordUtils = require('../lib/passwordUtils');

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!',
    });
  }
);

// Validate an existing user and issue a JWT
router.post('/login', function(req, res, next) {
  console.log('/jwt/login');
  User.findOne({ 'local.username': req.body.username })
    .then(user => {
      console.log('user created', user);
      if (!user) {
        res.status(401).json({ success: false, msg: 'could not find user' });
      }

      // Function defined at bottom of app.js
      const isValid = passwordUtils.validPassword(
        req.body.password,
        user.local.hash,
        user.local.salt
      );

      if (isValid) {
        const tokenObject = jwtUtils.issueJWT(user);

        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: 'you entered the wrong password' });
      }
    })
    .catch(err => {
      next(err);
    });
});

// Register a new user
router.post('/register', function(req, res, next) {
  console.log('Aqui OOO');
  const saltHash = passwordUtils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    local: {
      username: req.body.username,
      hash: hash,
      salt: salt,
      admin: true,
    },
  });

  newUser
    .save()
    .then(user => {
      console.log('dentro');
      res.json({ success: true, user: user });
    })
    .catch(err => res.json({ success: false, msg: err }));
});

module.exports = router;
