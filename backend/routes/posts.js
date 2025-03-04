import express from "express";
import { getAllPosts, createPost, getPostById, updatePost, deletePost } from "../controllers/postController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, postValidation } from "../middleware/validation.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply rate limiting to post routes
router.use(apiLimiter);

/**
 * @route GET /api/posts
 * @desc Get all posts or filter by userId
 * @access Public
 */
router.get("/", validate(postValidation.getByUser), getAllPosts);

/**
 * @route POST /api/posts
 * @desc Create a new post
 * @access Private
 */
router.post("/", 
  authenticateToken, 
  validate(postValidation.create), 
  createPost
);

/**
 * @route GET /api/posts/:id
 * @desc Get a post by ID
 * @access Public
 */
router.get("/:id", validate(postValidation.getById), getPostById);

/**
 * @route PUT /api/posts/:id
 * @desc Update a post
 * @access Private
 */
router.put("/:id", 
  authenticateToken, 
  validate(postValidation.getById), 
  updatePost
);

/**
 * @route DELETE /api/posts/:id
 * @desc Delete a post
 * @access Private
 */
router.delete("/:id", 
  authenticateToken, 
  validate(postValidation.delete), 
  deletePost
);

export default router;