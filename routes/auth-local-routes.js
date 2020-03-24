const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const isAuth = require('../middleware/authMiddleware').isAuth;
const isAdmin = require('../middleware/authMiddleware').isAdmin;
const User = require('../model/user-model');

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: 'login-success',
  })
);

router.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.pw);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    local: {
      username: req.body.uname,
      hash: hash,
      salt: salt,
      admin: true,
    },
  });

  newUser.save().then(user => {
    console.log(user);
  });

  res.redirect('/login');
});

module.exports = router;
