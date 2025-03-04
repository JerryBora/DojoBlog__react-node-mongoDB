import { body, validationResult, param, query } from 'express-validator';

/**
 * Middleware to validate request data
 * @param {Array} validations - Array of express-validator validations
 * @returns {Function} Express middleware function
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Return validation errors
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

/**
 * User validation rules
 */
export const userValidation = {
  signup: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers and underscores'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
  ],
  login: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  updateProfile: [
    body('bio')
      .optional()
      .isString()
      .withMessage('Bio must be a string')
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('socialLinks.twitter')
      .optional()
      .isURL()
      .withMessage('Twitter link must be a valid URL'),
    body('socialLinks.github')
      .optional()
      .isURL()
      .withMessage('GitHub link must be a valid URL'),
    body('socialLinks.linkedin')
      .optional()
      .isURL()
      .withMessage('LinkedIn link must be a valid URL')
  ]
};

/**
 * Post validation rules
 */
export const postValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required'),
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL')
  ],
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid post ID format')
  ],
  delete: [
    param('id')
      .isMongoId()
      .withMessage('Invalid post ID format')
  ],
  getByUser: [
    query('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID format')
  ]
};