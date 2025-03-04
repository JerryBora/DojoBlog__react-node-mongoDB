const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const responseData = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Check if there are validation errors to provide more specific error messages
    if (responseData.errors && Array.isArray(responseData.errors)) {
      const errorMessages = responseData.errors.map(err => `${err.field}: ${err.message}`).join(', ');
      throw new Error(errorMessages || responseData.message || 'An error occurred');
    }
    throw new Error(responseData.message || 'An error occurred');
  }
  // Return the data property if it exists, otherwise return the whole response
  return responseData.data || responseData;
};

const createHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const authAPI = {
  login: async (credentials) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  signup: async (userData) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  },
};

export const userAPI = {
  updateProfile: async (userId, profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  getUserProfile: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch profile');
    }
  },
};

export const postAPI = {
  getAllPosts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch all posts');
    }
  },

  createPost: async (postData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(postData),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error('Failed to create post');
    }
  },

  getUserPosts: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
        headers: createHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch user posts');
    }
  },

  deletePost: async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error('Failed to delete post');
    }
  },
};