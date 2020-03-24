const router = require('express').Router();

const viewsRoutes = require('./views-routes');
const authLocalRoutes = require('./auth-local-routes');
const authRoutes = require('./auth-routes');
const mockRoutes = require('./mock-routes');
const profileRoutes = require('./profile-routes');

/**
 * Views routes
 */

router.use('/', viewsRoutes);

/**
 * Auth local routes
 */

router.use('/', authLocalRoutes);

/**
 * Auth routes
 */

router.use('/auth', authRoutes);

/**
 * Mock routes
 */

router.use('/mock', mockRoutes);

/**
 * Profile routes
 */

router.use('/profile', profileRoutes);

module.exports = router;
