import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/userProfile.css';


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
  
  useEffect(() => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }
  
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for user ID:', user._id); // Debug log
        const response = await fetch(`http://localhost:5000/api/users/${user._id}/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const profileData = await response.json();
          console.log('Profile data received:', profileData); // Debug log
          setProfile(profileData);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch profile:', errorText);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [user]);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      alert('User ID is missing. Please log in again.');
      return;
    }
  
    try {
      console.log('Updating profile for user ID:', user._id); // Debug log
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bio: profile.bio,
          socialLinks: profile.socialLinks
        })
      });
    
      if (response.ok) {
        const updatedProfile = await response.json();
        console.log('Profile updated successfully:', updatedProfile); // Debug log
        setProfile(updatedProfile);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to update profile:', errorText);
        alert(`Failed to update profile: ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile. Please try again.');
    }
  };
  
  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts?userId=${user._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setUserPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };
  
  fetchUserPosts();
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
          <div className="custom-avatar large">{user.username[0].toUpperCase()}</div>
          <h2>{user.username}</h2>
        </div>
        {!isEditing ? (
          <button className="btn secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <button className="btn primary" onClick={handleProfileUpdate}>
            Save Changes
          </button>
        )}
      </div>
  
      {isEditing ? (
        <form className="profile-form">
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="form-group">
            <label>Social Links</label>
            <input
              type="url"
              placeholder="Twitter URL"
              value={profile.socialLinks.twitter}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, twitter: e.target.value }
              })}
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={profile.socialLinks.github}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, github: e.target.value }
              })}
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={profile.socialLinks.linkedin}
              onChange={(e) => setProfile({
                ...profile,
                socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
              })}
            />
          </div>
        </form>
      ) : (
        <div className="profile-content">
          <p className="bio">{profile.bio || 'No bio yet'}</p>
          <div className="social-links">
            {Object.entries(profile.socialLinks).map(([platform, url]) => (
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
        <div className="posts-grid">
          {Array.isArray(userPosts) && userPosts.length > 0 ? (
            userPosts.map(post => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 150)}...</p>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p>No posts yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;