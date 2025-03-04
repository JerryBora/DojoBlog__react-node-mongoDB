import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get the expiration part from JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Check if exp exists and compare with current time
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    }
    
    return false; // If no exp claim, assume token is valid
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired on error
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token && !isTokenExpired(token)) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && (parsedUser._id || parsedUser.id)) {
          return {
            ...parsedUser,
            _id: parsedUser._id || parsedUser.id
          };
        }
      } else if (token && isTokenExpired(token)) {
        // Clear expired token
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      return null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = (userData, token) => {
    if (!userData || (!userData._id && !userData.id) || !token) {
      console.error('Invalid user data or token:', { userData, token });
      return;
    }
    const processedUser = {
      ...userData,
      _id: userData._id || userData.id
    };
    setUser(processedUser);
    localStorage.setItem('user', JSON.stringify(processedUser));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      // If token is expired, log the user out
      logout();
      return null;
    }
    return token;
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
  
  // Periodically check token validity
  useEffect(() => {
    if (!user) return;
    
    const checkTokenInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        logout();
        clearInterval(checkTokenInterval);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkTokenInterval);
  }, [user]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);