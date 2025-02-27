import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/navbar.css';
import './styles/posts.css';
import './styles/forms.css';
import './styles/themeToggle.css';
import './styles/landing.css';
import './styles/userProfile.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
