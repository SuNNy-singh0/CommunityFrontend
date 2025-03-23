import React from "react";
import { FaBriefcase, FaBuilding, FaGlobe } from "react-icons/fa";
import "./JobBanner.css"; // Import CSS
import { useNavigate } from "react-router-dom";

const JobBanner = () => {
    const navigate = useNavigate();
  return (
    <div className="jobbanner-container">
      {/* Navbar */}
     

      {/* Banner Section */}
      <div className="jobbanner-hero">
        <div className="jobbanner-content">
          <h2 className="jobbanner-title">
            <span>Explore Top Developer</span>
            <span className="jobbanner-highlight">Job Opportunities</span>
          </h2>
          <p className="jobbanner-description">
            Find your next role in MERN, DSA, Java, and more. Join the fastest growing developer community.
          </p>

          {/* Job Stats */}
          <div className="jobbanner-stats">
            <div className="jobbanner-statbox">
              <FaBriefcase className="jobbanner-staticon" />
              <span className="jobbanner-stattext">Verified Job</span>
            </div>
            <div className="jobbanner-statbox">
              <FaBuilding className="jobbanner-staticon" />
              <span className="jobbanner-stattext">Walk-In Detail</span>
            </div>
            <div className="jobbanner-statbox">
              <FaGlobe className="jobbanner-staticon" />
              <span className="jobbanner-stattext">Remote Friendly</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="jobbanner-actions">
            <button className="jobbanner-primary-btn">View Jobs</button>
            <button className="jobbanner-secondary-btn" onClick={()=>{
                navigate('/jobboard')
            }}>Learn More</button>
          </div>
        </div>

        {/* Right Image */}
        <div className="jobbanner-image">
          <img
            className="jobbanner-image-img"
            src="/Jobposting.jpg"
            alt="Developer workspace"
          />
        </div>
      </div>
    </div>
  );
};

export default JobBanner;
