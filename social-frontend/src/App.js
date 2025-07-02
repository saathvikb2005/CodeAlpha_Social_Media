import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import PrivateRoute from './components/PrivateRoute';
import UserProfilePage from './pages/UserProfilePage'; // This now lists all users
import MyProfilePage from './pages/MyProfilePage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:username" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="/my-profile" element={<PrivateRoute><MyProfilePage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
