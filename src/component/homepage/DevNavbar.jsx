import React from 'react'
import "./DeveloperCommunity.css";
function DevNavbar() {
  return (
    <>
      <nav className="hero-navbar">
                <div className="hero-logo">
                    <img src="/logo.png" alt="Asli Engineer Logo" />
                    {/* <span className="hero-logo-text">Asli Engineer</span> */}
                </div>
                <div className="hero-links">
                    <a href="#" className="hero-nav-item">Home</a>
                    <a href="#" className="hero-nav-item">Tech Communities</a>
                    <a href="#" className="hero-nav-item">Contests & MCQs</a>
                    <a href="#" className="hero-nav-item">Leaderboard</a>
                    <a href="#" className="hero-nav-item">Jobs & Internships</a>
                    <a href="#" className="hero-nav-item">Newsletter</a>
                </div>
                <button className="hero-login-btn">Login</button>
            </nav>
    </>
  )
}

export default DevNavbar