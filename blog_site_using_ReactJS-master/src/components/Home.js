import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { postAPI } from '../services/api';
import OpenInNewWindowButton from './OpenInNewWindowButton';

const Home = ({ showDelete = false }) => {
  const history = useHistory();
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const handlePostClick = (postId) => {
    history.push(`/blogs/${postId}`);
  };

  const handleDelete = async (id) => {
    try {
      await postAPI.deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    }
  };

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const togglePostContent = (e, postId) => {
    e.stopPropagation();
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const truncateContent = (content) => {
    const words = content.split(/\s+/);
    if (words.length <= 256) return content;
    return words.slice(0, 256).join(' ') + '...';
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
    <div className="home">
      <div className="home-header">
        <h2>Blog Posts</h2>
        <Link to="/create" className="create-post-btn">Create New Post</Link>
      </div>
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">No posts found</div>
        ) : (
          posts.map(post => (
            <div className="post-card" key={post._id} onClick={() => handlePostClick(post._id)}>
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <OpenInNewWindowButton postId={post._id} />
              </div>
              <div className="post-content-preview">
                {expandedPosts.has(post._id) ? post.content : truncateContent(post.content)}
              </div>
              {post.content.split(/\s+/).length > 256 && (
                <button 
                  className="expand-btn" 
                  onClick={(e) => togglePostContent(e, post._id)}
                >
                  {expandedPosts.has(post._id) ? 'Show Less' : 'Read More'}
                </button>
              )}
              <div className="post-meta">
                <div className="post-info">
                  <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="post-author">{(post.author && post.author.username) || 'Unknown'}</span>
                </div>
                {showDelete && (
                  <button 
                    className="delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post._id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;