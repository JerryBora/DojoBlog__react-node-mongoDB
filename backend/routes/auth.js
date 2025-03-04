import express from 'express';
import { signup, login, getCurrentUser } from '../controllers/authController.js';
import { validate, userValidation } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', validate(userValidation.signup), signup);

/**
 * @route POST /api/auth/login
 * @desc Login user and get token
 * @access Public
 */
router.post('/login', validate(userValidation.login), login);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticateToken, getCurrentUser);

export default router;