import React from "react";
import { FaCode, FaEarlybirds, FaHome, FaReact } from "react-icons/fa";
import "./DeveloperCommunity.css";
import { IoLogoElectron } from "react-icons/io5";
import DevNavbar from "./DevNavbar";
const DeveloperCommunity = () => {
    return (
        <>
        <DevNavbar/>
        <div className="hero-container">
            {/* Navbar */}
          

            {/* Main Section */}
            <div className="hero-content">
                <div className="hero-text">
                    <h1>
                        Empower Your Dev Journey With <br />
                        <span className="hero-text-highlight">Code</span> & <span className="hero-text-highlight-blue">Community!</span>
                    </h1>
                    <p>
                        Join Thousands Of Developers. Solve Daily MCQs, Compete In Weekly
                        Contests, Track Your Rank On Our Leaderboard, And Land Your Dream
                        Tech Job – All In One Place!
                    </p>
                    <div className="hero-buttons">
                        <button className="hero-join-btn">Join Now</button>
                        <button className="hero-explore-btn">Explore More</button>
                    </div>
                </div>

                {/* Animated Info Cards */}
                {/* <div className="hero-info-container">
          <div className="hero-info-background"></div>
          <div className="hero-info-card internship">Internship<br /> <span>Exclusive Opportunities For Devs</span></div>
          <div className="hero-info-card jobs">Jobs<br /> <span>Recommendations</span></div>
          <div className="hero-info-card weekly-contest">Weekly Contest<br /> <span>Personalized Practice</span></div>
          <div className="hero-info-card daily-challenges">Daily Coding Challenges<br /> <span>Improve Logic With MCQs</span></div>
          <div className="hero-info-card tech-communities">Tech Communities<br /> <span>Engage With MERN, DSA, Java, Python & More</span></div>
        </div> */}

                <div className="floating-container">
                    {/* Background Circle */}
                    <div className="floating-background">
                        <FaReact className="floating-center-icon" color="green" size={40} />
                    </div>

                    {/* Floating Cards */}
                    <div className="floating-card internship">Internship <br /><span>Exclusive Opportunities For Devs</span></div>
                    <div className="floating-card jobs">Jobs <br /><span>Recommendations</span></div>
                    <div className="floating-card weekly-contest">Weekly Contest <br /><span>Personalized Practice</span></div>
                    <div className="floating-card daily-challenges">Daily Coding Challenges <br /><span>Improve Logic With MCQs</span></div>
                    <div className="floating-card tech-communities">Tech Communities <br /><span>Engage With MERN, DSA, Java, Python & More</span></div>
                </div>
            </div>


        </div>
        </>
    );
};

export default DeveloperCommunity;
