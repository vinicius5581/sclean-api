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

router.post('/confirmation', function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('token', 'Token cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors
  var errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);

  // Find a matching token
  Token.findOne({ token: req.body.token }, function(err, token) {
    if (!token)
      return res.status(400).send({
        type: 'not-verified',
        msg:
          'We were unable to find a valid token. Your token my have expired.',
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId, email: req.body.email }, function(
      err,
      user
    ) {
      if (!user)
        return res
          .status(400)
          .send({ msg: 'We were unable to find a user for this token.' });
      if (user.isVerified)
        return res.status(400).send({
          type: 'already-verified',
          msg: 'This user has already been verified.',
        });

      // Verify and save the user
      user.isVerified = true;
      user.save(function(err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).send('The account has been verified. Please log in.');
      });
    });
  });
});

router.post('/resend', function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors
  var errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);

  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user)
      return res
        .status(400)
        .send({ msg: 'We were unable to find a user with that email.' });
    if (user.isVerified)
      return res.status(400).send({
        msg: 'This account has already been verified. Please log in.',
      });

    // Create a verification token, save it, and send email
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString('hex'),
    });

    // Save the token
    token.save(function(err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }

      // Send the email
      var transporter = nodemailer.createTransport({
        service: 'Sendgrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
      var mailOptions = {
        from: 'no-reply@codemoto.io',
        to: user.email,
        subject: 'Account Verification Token',
        text:
          'Hello,\n\n' +
          'Please verify your account by clicking the link: \nhttp://' +
          req.headers.host +
          '/confirmation/' +
          token.token +
          '.\n',
      };
      transporter.sendMail(mailOptions, function(err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res
          .status(200)
          .send('A verification email has been sent to ' + user.email + '.');
      });
    });
  });
});

module.exports = router;
