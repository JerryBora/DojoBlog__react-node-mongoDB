import Post from '../models/Post.js';
import { asyncHandler } from '../utils/responseHandler.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * Get all posts
 * @route GET /api/posts
 */
export const getAllPosts = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  
  // Filter by user if userId is provided
  const filter = userId ? { userId } : {};
  
  // Sort by creation date (newest first)
  const posts = await Post.find(filter).sort({ createdAt: -1 });
  
  return sendSuccess(res, 200, 'Posts retrieved successfully', posts);
});

/**
 * Create a new post
 * @route POST /api/posts
 */
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;
  const userId = req.user.userId; // From auth middleware
  
  const newPost = new Post({
    title,
    content,
    image,
    userId // Associate post with user
  });
  
  await newPost.save();
  return sendSuccess(res, 201, 'Post created successfully', newPost);
});

/**
 * Get a post by ID
 * @route GET /api/posts/:id
 */
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    return sendError(res, 404, 'Post not found');
  }
  
  return sendSuccess(res, 200, 'Post retrieved successfully', post);
});

/**
 * Update a post
 * @route PUT /api/posts/:id
 */
export const updatePost = asyncHandler(async (req, res) => {
  const { title, content, image } = req.body;
  
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    return sendError(res, 404, 'Post not found');
  }
  
  // Check if user owns the post
  if (post.userId && post.userId.toString() !== req.user.userId) {
    return sendError(res, 403, 'Not authorized to update this post');
  }
  
  post.title = title;
  post.content = content;
  if (image) post.image = image;
  
  const updatedPost = await post.save();
  return sendSuccess(res, 200, 'Post updated successfully', updatedPost);
});

/**
 * Delete a post
 * @route DELETE /api/posts/:id
 */
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    return sendError(res, 404, 'Post not found');
  }
  
  // Check if user owns the post
  if (post.userId && post.userId.toString() !== req.user.userId) {
    return sendError(res, 403, 'Not authorized to delete this post');
  }
  
  await post.deleteOne();
  return sendSuccess(res, 200, 'Post deleted successfully');
});