import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import "./JobAlertBannerUniqueXylo.css";
function Footer() {
    const navigate = useNavigate();

    const handleScroll = (sectionId) => {
        if (window.location.pathname !== '/') {
            navigate('/', { state: { scrollTo: sectionId } });
        } else {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    return (
      <>
       <div className="xylo-jobalert-footer" style={{marginTop: '30px'}}>
        <div className="xylo-jobalert-footer-left">
          <div className="xylo-jobalert-logo">
            
            <span className="xylo-jobalert-logotxt"><b>Asli</b> <span style={{color: '#d39e5e'}}>Engineer</span></span>
          </div>
          <div className="xylo-jobalert-footer-desc">
            Empowering Developers. Building Futures.<br/>
            <span className="xylo-jobalert-footer-descsub">
             Our Platform For Tech Communities, Coding Challenges, Job Opportunities, And More!
            </span>
          </div>
        </div>
        <div className="xylo-jobalert-footer-mid">
          <div className="xylo-jobalert-footer-linktitle">Quick Links</div>
          <ul className="xylo-jobalert-footer-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/about">About Us</NavLink></li>
            <li><NavLink to="/techjob">Jobs & Internship</NavLink></li>
            <li><a onClick={() => handleScroll('tech-communities')}>Communities</a></li>
            <li><a onClick={() => handleScroll('contests-mcqs')}>Contests</a></li>
            <li><a onClick={() => handleScroll('contests-mcqs')}>MCQs</a></li>
          </ul>
        </div>
        <div className="xylo-jobalert-footer-right">
          <div className="xylo-jobalert-footer-linktitle">Follow Us For Updates And Inspiration!</div>
          <div className="xylo-jobalert-footer-socials">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          </div>
        </div>
      </div>
      </>
    )
}

export default Footer