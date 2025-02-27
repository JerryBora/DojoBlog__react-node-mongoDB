import React, { createContext, useState, useContext, } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && (parsedUser._id || parsedUser.id)) {
          return {
            ...parsedUser,
            _id: parsedUser._id || parsedUser.id
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = (userData) => {
    if (!userData || (!userData._id && !userData.id)) {
      console.error('Invalid user data:', userData);
      return;
    }
    const processedUser = {
      ...userData,
      _id: userData._id || userData.id
    };
    setUser(processedUser);
    localStorage.setItem('user', JSON.stringify(processedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);