
import React from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import PostForm from './components/PostForm';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from './components/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import UserProfile from './components/UserProfile';
import Background from './components/Background';
import BlogPost from './components/BlogPost';
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
        <div className="App">
          <Background />
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route path={["/blogs", "/login", "/signup", "/create", "/profile", "/blogs/:id"]}>
              <Navbar />
              <div className="content content-restricted">
                <Switch>
                  <Route exact path="/blogs" component={Home} />
                  <Route path="/blogs/:id" component={BlogPost} />
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={Signup} />
                  <Route path="/create" component={PostForm} />
                  <Route path="/profile" component={UserProfile} />
                </Switch>
              </div>
            </Route>
            <Route path="*">
              <Navbar />
              <div className="content content-restricted">
                <NotFound/>
              </div>
            </Route>
          </Switch>
        </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
