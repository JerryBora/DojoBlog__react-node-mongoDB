# Blog Site

A modern, full-stack blog platform built with React.js for the frontend and Node.js/Express.js for the backend, offering a comprehensive solution for creating, managing, and sharing blog content with secure user authentication.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Frontend Implementation](#frontend-implementation)
- [Backend Implementation](#backend-implementation)
- [API Documentation](#api-documentation)
- [Styling System](#styling-system)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

This Blog Site is a modern web application that demonstrates full-stack development best practices. It features a React.js frontend with a clean, intuitive interface, backed by a robust Node.js/Express.js backend with MongoDB integration. The platform implements secure user authentication, responsive design, and efficient state management.

### Key Features

- User authentication with JWT
- CRUD operations for blog posts
- Rich text editing for post content
- Responsive design across devices
- User profile management
- Social sharing capabilities
- Comment system
- Search functionality

## System Architecture

### Frontend Architecture
- **React.js**: Component-based UI development
- **Context API**: Global state management for auth and theme
- **React Router**: Client-side routing with protected routes
- **CSS Modules**: Scoped styling solution

### Backend Architecture
- **Node.js/Express.js**: RESTful API server
- **MongoDB**: NoSQL database for flexible data storage
- **JWT**: Secure authentication mechanism
- **Bcrypt**: Password hashing

### Security Features
- Secure password hashing
- JWT-based authentication
- Protected API endpoints
- Input validation and sanitization
- CORS configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd blog-site
```

2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

4. Environment Setup
```bash
# Backend .env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

# Frontend .env
REACT_APP_API_URL=http://localhost:5000
```

## Project Structure

```
├── backend/                 # Backend server implementation
│   ├── models/             # Mongoose models
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Express app setup
│   └── package.json        # Backend dependencies
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── styles/            # CSS modules and global styles
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── App.js             # Main application component
├── public/                # Static assets
└── package.json           # Frontend dependencies and scripts
```

## Frontend Implementation

### Component Architecture
- Functional components with hooks
- Custom hooks for reusable logic
- Context API for theme and auth state

### Routing System
- Protected routes for authenticated users
- Dynamic route parameters for blog posts
- Nested routing for complex views

### State Management
- Context API for global state
- Local state with useState
- Custom hooks for complex state logic

## Backend Implementation

### Database Schema
- User model with secure password storage
- Post model with rich content support
- Relationships between users and posts

### API Routes
- Authentication endpoints (login/signup)
- CRUD operations for posts
- User profile management
- Comment system endpoints

### Middleware
- Authentication middleware
- Error handling middleware
- Request validation
- CORS configuration

## API Documentation

### Authentication Endpoints

```
POST /api/auth/signup
POST /api/auth/login
```

### Post Endpoints

```
GET    /api/posts
POST   /api/posts
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id
```

### User Endpoints

```
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

## Styling System

### Design Tokens
```css
:root {
  --primary-color: #6e4555;
  --secondary-color: #f8edeb;
  --accent-color: #3a3238;
  --text-primary: #333333;
  --text-secondary: #666666;
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Fluid typography system

## Development Workflow

### Scripts

Frontend:
```bash
npm start    # Start development server
npm test     # Run tests
npm build    # Create production build
```

Backend:
```bash
npm start    # Start production server
npm run dev  # Start development server with nodemon
```

## Testing

### Frontend Testing
- Component testing with React Testing Library
- Integration tests for user flows
- Snapshot testing for UI components

### Backend Testing
- API endpoint testing
- Database operations testing
- Authentication flow testing

## Deployment

### Frontend Deployment
1. Build the React application
2. Configure environment variables
3. Deploy to hosting service (e.g., Netlify, Vercel)

### Backend Deployment
1. Set up production MongoDB instance
2. Configure environment variables
3. Deploy to cloud platform (e.g., Heroku, DigitalOcean)

## Contributing

1. Fork the Repository
```bash
git clone <your-forked-repo-url>
cd blog-site
```

2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

3. Make Your Changes
- Follow the existing code style
- Add comments for complex logic
- Update tests if necessary

4. Commit Your Changes
```bash
git commit -m "Add: brief description of your changes"
```

5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request
- Provide a clear description of the changes
- Reference any related issues
- Wait for review and address any feedback


