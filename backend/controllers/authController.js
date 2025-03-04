import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/responseHandler.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * Register a new user
 * @route POST /api/auth/signup
 */
export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
  });
  
  if (existingUser) {
    return sendError(res, 400, 'Username or email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({
    username,
    email,
    password: hashedPassword
  });

  await user.save();
  return sendSuccess(res, 201, 'User created successfully');
});

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return sendError(res, 400, 'Invalid credentials');
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return sendError(res, 400, 'Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Send user data and token
  return sendSuccess(res, 200, 'Login successful', {
    token,
    user: {
      _id: user._id.toString(),
      username: user.username,
      email: user.email
    }
  });
});

/**
 * Get current user
 * @route GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  
  if (!user) {
    return sendError(res, 404, 'User not found');
  }
  
  return sendSuccess(res, 200, 'User retrieved successfully', { user });
});