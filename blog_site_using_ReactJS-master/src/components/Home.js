import React from 'react';
import { Link } from 'react-router-dom';
import PostList from './PostList';

const Home = () => {
  return (
    <div className="home">
      <div className="home-header">
        <h2>Blog Posts</h2>
        <Link to="/create" className="create-post-btn">Create New Post</Link>
      </div>
      <div className="posts-container">
        <PostList showDelete={false} />
      </div>
    </div>
  );
};

export default Home;