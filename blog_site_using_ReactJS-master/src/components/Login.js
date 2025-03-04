import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const history = useHistory();

  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/profile' } };

  // Check if user was redirected from another page
  useEffect(() => {
    // If there's a redirect message in the location state, show it
    if (location.state && location.state.message) {
      setError(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await authAPI.login({ email, password });
      
      // The backend returns { token, user } directly or within data property
      // Extract user and token from the response
      const user = response.user;
      const token = response.token;
      
      // Validate the response data structure
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      const userData = {
        _id: user._id,
        username: user.username || '',
        email: user.email || ''
      };
      
      // Validate required fields
      if (!userData._id) {
        throw new Error('User ID is missing from response');
      }
      
      // Let the AuthContext handle storage
      login(userData, token);
      
      // Redirect to the page user was trying to access, or profile by default
      history.replace(from);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Login</h2>
      </div>
      <div className="auth-form">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;