import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const access = localStorage.getItem('access');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">SocialApp</div>
      <div className="navbar-links">
        {access ? (
          <>
            <NavLink to="/feed" activeclassname="active">Feed</NavLink>
            <NavLink to="/create" activeclassname="active">Create</NavLink>
            <NavLink to="/my-profile" activeclassname="active">My Profile</NavLink>
            <NavLink to="/users" activeclassname="active">Users</NavLink>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" activeclassname="active">Login</NavLink>
            <NavLink to="/register" activeclassname="active">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
