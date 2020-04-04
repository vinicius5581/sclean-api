const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const isAuth = require('../middleware/authMiddleware').isAuth;
const isAdmin = require('../middleware/authMiddleware').isAdmin;
const User = require('../model/user-model');

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get('/login', (req, res, next) => {
  const form =
    '<h1>Login Page</h1><br/><br/>\
        <a class="google-btn" href="/auth/google">Google+</a><br/><br/>\
        <a class="google-btn" href="/auth/facebook">Facebook</a><br/><br/>\
        <form method="POST" action="/login">\
        Enter Username:<br><input type="email" name="email">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

router.get('/register', (req, res, next) => {
  const form =
    '<h1>Register Page</h1><br/><br/>\
        <a class="google-btn" href="/auth/google">Google+</a><br/><br/>\
        <a class="google-btn" href="/auth/facebook">Facebook</a><br/><br/>\
        <form method="post" action="register">\
        Enter Username:<br><input type="email" name="email">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

router.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the route.');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
  res.send('You made it to the admin route.');
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
  req.logout();
  // res.redirect('/login');
});

router.get('/login-success', (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});

module.exports = router;
