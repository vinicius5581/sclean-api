const router = require('express').Router();
const passport = require('passport');

router.get(
  '/',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);

router.get('/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('../../profile');
});

module.exports = router;
