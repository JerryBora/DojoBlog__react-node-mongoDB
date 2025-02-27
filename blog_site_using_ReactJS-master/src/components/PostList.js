import React from 'react';
import { useEffect, useState } from "react";

const PostList = ({ showDelete = false }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetch("/api/posts")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then(data => {
        const sortedPosts = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
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
      {posts.map(post => (
        <div className="post-card" key={post._id}>
          <div className="post-header">
            <h2 className="post-title">{post.title}</h2>
          </div>
          <div className="post-content">
            <p>
              {expandedPosts[post._id] ? post.content : truncateText(post.content)}
            </p>
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
      ))}
    </div>
  );
};

export default PostList;