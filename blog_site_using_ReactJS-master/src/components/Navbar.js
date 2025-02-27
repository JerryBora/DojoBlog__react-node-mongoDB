import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    history.push('/');
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/">
          <h1>The Dojo Blog</h1>
        </Link>
        <div className="links">
          {location.pathname !== '/blogs' && <Link to="/blogs">Blogs</Link>}
          <ThemeToggle />
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <div 
              className="user-section" 
              ref={dropdownRef}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div className="user-info">
                <span className="avatar">{user.email[0].toUpperCase()}</span>
              </div>
              <div className={`user-dropdown ${showDropdown ? 'active' : ''}`}>
                <div className="dropdown-header">
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="dropdown-items">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>View Profile</Link>
                  <Link to="/create" onClick={() => setShowDropdown(false)}>Create Post</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;