import React from 'react'
import "./Mainpage.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
function Footer() {
  return (
    <>
      <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src="/logo.png" alt="Asli Engineer" className="footer-logo-image" />
                   
                </div>
                <div className="footer-social">
                    <p className="footer-social-text">Join us on all platforms</p>
                    <div className="footer-icons">
                        <FaFacebook className="footer-icon" />
                        <FaInstagram className="footer-icon" />
                        <FaLinkedin className="footer-icon" />
                        <FaYoutube className="footer-icon" />
                    </div>
                </div>
            </div>
            <div className="footer-divider"></div>
            <p className="footer-copyright">All copyright reserved to Asli Engineer</p>
        </footer>
    </>
  )
}

export default Footer