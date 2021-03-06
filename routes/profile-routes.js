const router = require('express').Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

router.get('/', authCheck, (req, res) => {
  res.send(
    'you are logged in, this is your profile - ' + req.user.local.displayName
  );
});

module.exports = router;
