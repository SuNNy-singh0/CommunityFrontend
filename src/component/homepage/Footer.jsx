import React from 'react'
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import "./JobAlertBannerUniqueXylo.css";
function Footer() {
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
              Your Go-To Platform For Tech Communities, Coding Challenges, Job Opportunities, And More!
            </span>
          </div>
        </div>
        <div className="xylo-jobalert-footer-mid">
          <div className="xylo-jobalert-footer-linktitle">Quick Links</div>
          <ul className="xylo-jobalert-footer-links">
            <li>Home</li>
            <li>About Us</li>
            <li>Jobs & Internship</li>
            <li>Communities</li>
            <li>Contests</li>
            <li>MCQs</li>
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