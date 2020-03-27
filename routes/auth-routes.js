const router = require('express').Router();

const authFacebookRoutes = require('./auth-facebook-routes');
const authGoogleRoutes = require('./auth-google-routes');
const authLocalRoutes = require('./auth-local-routes');
const authJwtRoutes = require('./auth-jwt-routes');

/**
 * Facebook authentication
 */

router.use('/facebook/', authFacebookRoutes);

/**
 * Google authentication
 */

router.use('/google/', authGoogleRoutes);

/**
 * Local authentication
 */

// router.use('/local/', authLocalRoutes);

/**
 * JWT authentication
 */

router.use('/jwt/', authJwtRoutes);

module.exports = router;
