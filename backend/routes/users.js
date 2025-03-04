import express from 'express';
import { getUserProfile, updateUserProfile, getUserPosts } from '../controllers/userController.js';
import { authenticateToken, authorizeUser } from '../middleware/auth.js';
import { validate, userValidation } from '../middleware/validation.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to user routes
router.use(apiLimiter);

/**
 * @route GET /api/users/:userId/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/:userId/profile', 
  authenticateToken, 
  getUserProfile
);

/**
 * @route PUT /api/users/:userId/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/:userId/profile', 
  authenticateToken, 
  authorizeUser, 
  validate(userValidation.updateProfile),
  updateUserProfile
);

/**
 * @route GET /api/users/:userId/posts
 * @desc Get posts by user
 * @access Private
 */
router.get('/:userId/posts', 
  authenticateToken, 
  getUserPosts
);

export default router;