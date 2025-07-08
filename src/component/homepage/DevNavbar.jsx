import React, { useState, useEffect } from 'react'
import "./DeveloperCommunity.css";
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdOutlineLogin } from 'react-icons/md';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, logout } from '../../utils/auth';

function DevNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUsername(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="hero-navbar">
        <div className="hero-logo">
          <img src="/logo.png" alt="Asli Engineer Logo" />
          {/* <span className="hero-logo-text">Asli Engineer</span> */}
        </div>
        
        {/* Hamburger Menu Icon */}
        <div className="hero-hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        {/* Navigation Links */}
        <div className={`hero-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="hero-nav-item">Home</Link>
          <Link to="/" className="hero-nav-item">Tech Communities</Link>
          <Link to="/" className="hero-nav-item">Contests & MCQs</Link>
          <Link to="/" className="hero-nav-item">Leaderboard</Link>
          <Link to="/techjob" className="hero-nav-item">Jobs & Internships</Link>
         
        </div>
        
        {/* Conditional Login/Logout Button */}
        {isAuthenticated() ? (
          <div className="hero-user-section">
            <span className="hero-username" onClick={() => navigate('/profile')}>
              {username || 'User'}
            </span>
            <button className="hero-login-btn" onClick={handleLogout}>
              <RiLogoutCircleLine size={20} style={{ marginRight: '5px' }} />
              Logout
            </button>
          </div>
        ) : (
          <button className="hero-login-btn" onClick={() => navigate('/login')}>
            <MdOutlineLogin size={20} style={{ marginRight: '5px' }} />
            Login
          </button>
        )}
      </nav>
    </>
  )
}

export default DevNavbar