import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { postAPI } from '../services/api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const BlogPost = () => {
  const { id } = useParams();
  const history = useHistory();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postAPI.getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading post...</div>
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

  if (!post) {
    return (
      <div className="not-found-container">
        <div className="not-found">Post not found</div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(marked.parse(post.content))
          }}
        />
        <div className="post-actions">
          <button 
            className="back-button"
            onClick={() => history.push('/blogs')}
          >
            Back to Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;