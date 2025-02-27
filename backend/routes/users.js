import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching profile for user:', userId); // Debug log

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the full profile data
    res.json({
      bio: user.bio || '',
      socialLinks: user.socialLinks || {
        twitter: '',
        github: '',
        linkedin: ''
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const { bio, socialLinks } = req.body;
    const userId = req.params.userId;
    console.log('Updating profile for user:', userId, { bio, socialLinks }); // Debug log

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    user.bio = bio;
    user.socialLinks = socialLinks;
    await user.save();

    res.json({
      bio: user.bio,
      socialLinks: user.socialLinks
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;