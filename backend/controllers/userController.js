

import User from '../models/User.js';
import { asyncHandler } from '../utils/responseHandler.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * Get user profile
 * @route GET /api/users/:userId/profile
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  return sendSuccess(res, 200, 'Profile retrieved successfully', {
    bio: user.bio || '',
    socialLinks: user.socialLinks || {
      twitter: '',
      github: '',
      linkedin: ''
    }
  });
});

/**
 * Update user profile
 * @route PUT /api/users/:userId/profile
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { bio, socialLinks } = req.body;
  const userId = req.params.userId;

  // Verify the user exists
  const user = await User.findById(userId);
  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  // Update user profile
  user.bio = bio;
  user.socialLinks = socialLinks;
  await user.save();

  return sendSuccess(res, 200, 'Profile updated successfully', {
    bio: user.bio,
    socialLinks: user.socialLinks
  });
});

/**
 * Get user posts
 * @route GET /api/users/:userId/posts
 */
export const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  
  // Import Post model to fetch user's posts
  const Post = (await import('../models/Post.js')).default;
  
  try {
    // Find all posts by this user and populate necessary fields
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .select('title content image createdAt updatedAt');
    
    if (!posts) {
      return sendError(res, 404, 'No posts found for this user');
    }

    // Transform posts to ensure consistent data structure
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      image: post.image || '',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));

    return sendSuccess(res, 200, 'User posts retrieved successfully', {
      posts: transformedPosts
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return sendError(res, 500, 'Failed to fetch user posts');
  }
});