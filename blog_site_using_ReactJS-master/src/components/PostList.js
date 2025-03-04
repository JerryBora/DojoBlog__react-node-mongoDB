import React, { useEffect, useState } from 'react';
import { postAPI } from '../services/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const PostList = ({ showDelete = false }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});

  const handleDelete = async (id) => {
    try {
      await postAPI.deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postAPI.getAllPosts();
        const sortedPosts = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } catch (err) {
        setError(err.message || 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const truncateText = (text) => {
    if (!text) return '';
    if (text.length <= 200) return text;
    return `${text.substring(0, 200).trim()}...`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.length === 0 ? (
        <div className="no-posts">No posts found</div>
      ) : (
        posts.map(post => (
          <div className="post-card" key={post._id}>
            <div className="post-header">
              <h2 className="post-title">{post.title}</h2>
            </div>
            <div className="post-content">
              <div 
                className="preview-content"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(marked.parse(expandedPosts[post._id] ? post.content : truncateText(post.content)))
                }}
              />
              {post.content && post.content.length > 200 && (
                <button 
                  className="expand-btn" 
                  onClick={() => toggleExpand(post._id)}
                >
                  {expandedPosts[post._id] ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
            <div className="post-meta">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {showDelete && (
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;