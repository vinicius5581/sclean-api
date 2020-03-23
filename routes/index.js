const router = require('express').Router();

const rootRoutes = require('./root-routes');
const authRoutes = require('./auth-routes');
const mockRoutes = require('./mock-routes');
const profileRoutes = require('./profile-routes');

/**
 * Root routes
 */

 router.use('/',rootRoutes);

/**
 * Mock routes
 */

 router.use('/mock', mockRoutes);

/**
 * Auth routes
 */

router.use('/auth', authRoutes);

/**
 * Profile routes
 */

router.use('/profile', profileRoutes);

module.exports = router;