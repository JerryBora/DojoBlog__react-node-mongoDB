import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/userProfile.css';
import { userAPI, postAPI } from '../services/api';



const UserProfile = () => {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    bio: '',
    socialLinks: {
      twitter: '',
      github: '',
      linkedin: ''
    }
  });
  
  const { getToken } = useAuth();
  
  const fetchProfile = useCallback(async () => {
    if (!user || !user._id) return;
    
    try {
      setLoading(true);
      const profileData = await userAPI.getUserProfile(user._id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      setUpdateError('User ID is missing. Please log in again.');
      return;
    }
  
    try {
      setIsUpdating(true);
      setUpdateError('');
      
      const profileData = {
        bio: profile.bio,
        socialLinks: profile.socialLinks
      };
      
      const updatedProfile = await userAPI.updateProfile(user._id, profileData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      setUpdateError(error.message || 'An error occurred while updating the profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      setPostsLoading(true);
      await postAPI.deletePost(postId);
      // Update the posts list by filtering out the deleted post
      setUserPosts(userPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error.message);
      setPostsError('Failed to delete post: ' + error.message);
    } finally {
      setPostsLoading(false);
    }
  };
  
  
  
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState('');

  const fetchUserPosts = useCallback(async () => {
    if (!user || !user._id) return;
    
    try {
      setPostsLoading(true);
      setPostsError('');
      
      const data = await postAPI.getUserPosts(user._id);
      console.log('User posts API response:', data); // Debug log to see the actual response
      
      // The backend always returns data with a 'posts' property
      if (data && data.posts && Array.isArray(data.posts)) {
        setUserPosts(data.posts);
      } else {
        console.error('Unexpected posts data format:', data);
        setUserPosts([]);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error.message);
      setPostsError(error.message);
      setUserPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, [user, getToken]);
  
  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);
  
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="custom-avatar large">{user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}</div>
          <h2>{user.username || user.email}</h2>
        </div>
        {!isEditing ? (
          <button className="btn secondary" onClick={() => setIsEditing(true)} disabled={loading}>
            Edit Profile
          </button>
        ) : (
          <button className="btn primary" onClick={handleProfileUpdate} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>
  
      {updateError && <div className="error-message">{updateError}</div>}
      
      {isEditing ? (
        <form className="profile-form" onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself"
              disabled={isUpdating}
            />
          </div>
          <div className="form-group">
            <label>Social Links</label>
            <input
              type="url"
              placeholder="Twitter URL"
              value={(profile.socialLinks && profile.socialLinks.twitter) || ''}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, twitter: e.target.value }
              })}
              disabled={isUpdating}
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={(profile.socialLinks && profile.socialLinks.github) || ''}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, github: e.target.value }
              })}
              disabled={isUpdating}
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={(profile.socialLinks && profile.socialLinks.linkedin) || ''}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
              })}
              disabled={isUpdating}
            />
          </div>
        </form>
      ) : (
        <div className="profile-content">
          <p className="bio">{profile.bio || 'No bio yet'}</p>
          <div className="social-links">
            {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, url]) => (
              url && (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                  {platform}
                </a>
              )
            ))}
          </div>
        </div>
      )}
  
      <div className="user-posts">
        <h3>My Posts</h3>
        {postsError && <div className="error-message">{postsError}</div>}
        {postsLoading ? (
          <div className="loading">Loading posts...</div>
        ) : (
          <div className="posts-grid">
            {userPosts && userPosts.length > 0 ? (
              userPosts.map(post => (
                <div key={post._id} className="post-card">
                  <h3 className="post-title">{post.title}</h3>
                  <button 
                    className="delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(post._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );



};

export default UserProfile;