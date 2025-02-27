import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-content">
        <div className="landing-text">
          <h1>Welcome to The Dojo Blog</h1>
          <p className="tagline">Where ideas come to life</p>
          <p className="description">Share your thoughts, experiences, and stories with our growing community of readers and writers.</p>
          <div className="landing-buttons">
            <Link to="/blogs" className="btn primary">Explore Blogs</Link>
            <Link to="/create" className="btn secondary">Start Writing</Link>
          </div>
        </div>
        <div className="landing-visual">
          <div className="feature">
            <h3>Share Your Story</h3>
            <p>Express yourself through writing</p>
          </div>
          <div className="feature">
            <h3>Connect</h3>
            <p>Join our community of writers</p>
          </div>
          <div className="feature">
            <h3>Discover</h3>
            <p>Read inspiring content</p>
          </div>
          <div className="feature">
            <h3>Grow</h3>
            <p>Learn and evolve together</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;