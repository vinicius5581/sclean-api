const router = require('express').Router();
const passport = require('passport');

router.get(
  '/',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

router.get('/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('../../profile');
});

module.exports = router;
