const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('req.user: ', req.user)
    res.redirect('/profile');
});



router.get('/facebook', passport.authenticate('facebook', {
    scope: ['read_stream', 'publish_actions'] 
}));

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    console.log('req.user: ', req.user)
    res.redirect('/profile');
});

module.exports = router;



// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/',
//                                       failureRedirect: '/login' }));