import rateLimit from 'express-rate-limit';

/**
 * Creates a rate limiter middleware with specified configuration
 * @param {Object} options - Rate limiter options
 * @returns {Function} Express middleware function
 */
export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes by default
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
      success: false,
      message: 'Too many requests, please try again later.'
    }
  };

  return rateLimit({
    ...defaultOptions,
    ...options
  });
};

// Authentication rate limiter - balanced security and usability
export const authLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 5 minutes.'
  }
});

// API rate limiter - general purpose for API endpoints
export const apiLimiter = createRateLimiter();