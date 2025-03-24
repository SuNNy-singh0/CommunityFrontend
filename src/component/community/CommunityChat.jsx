import React, { useState } from "react";
import {
  FaBriefcase,
  FaBell,
  FaCalendar,
  FaClock,
  FaPaperclip,
  FaPaperPlane,
  FaSearch,
  FaUserCircle,
  FaFileAlt,
} from "react-icons/fa";
import "./CommunityChat.css"; // Import the CSS file

const CommunityChat = () => {
  const [jobDropdown, setJobDropdown] = useState(false);

  return (
    <div className="communitychat-container">
      {/* Header */}
      <header className="communitychat-header">
        <div className="communitychat-header-content">
          <div className="communitychat-logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className="communitychat-dropdown">
            <button className="communitychat-job-button" onClick={() => setJobDropdown(!jobDropdown)}>
              <FaBriefcase />
              <span>Job Opportunities</span>
            </button>
            {jobDropdown && (
              <div className="communitychat-job-dropdown">
                <div className="communitychat-job-list">
                  <div className="communitychat-job-item">
                    <p className="communitychat-job-title">Senior Frontend Developer</p>
                    <span className="communitychat-job-info">Google • Full-time • Remote</span>
                    <button className="communitychat-apply-button">Apply Now</button>
                  </div>
                  <div className="communitychat-job-item">
                    <p className="communitychat-job-title">UX Designer</p>
                    <span className="communitychat-job-info">Apple • Full-time • On-site</span>
                    <button className="communitychat-apply-button">Apply Now</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="communitychat-header-actions">
            <button className="communitychat-notification-button">
              <FaBell />
            </button>
            <img
              src="/Usericon.png"
              alt="Profile"
              className="communitychat-profile-pic"
            />
          </div>
        </div>
      </header>

      {/* Contest Section */}
      <div className="communitychat-contest">
        <div className="communitychat-contest-content">
          <div className="communitychat-contest-header">
            <span>Upcoming Contest</span>
            <span>Posted by Admin</span>
          </div>
          <p className="communitychat-contest-title">Web Development Challenge 2024</p>
          <p className="communitychat-contest-description">
            Build a responsive e-commerce website using modern web technologies.
          </p>
          <div className="communitychat-contest-details">
            <span>
              <FaCalendar /> March 15, 2024
            </span>
            <span>
              <FaClock /> 2:00 PM GMT
            </span>
            <span className="communitychat-contest-level">Intermediate</span>
          </div>
          <div className="communitychat-contest-prizes">
            <p>Prizes:</p>
            <ul>
              <li>1st Place: $1000</li>
              <li>2nd Place: $500</li>
              <li>3rd Place: $250</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="communitychat-main">
        <div className="communitychat-chat">
          <div className="communitychat-messages">
            <div className="communitychat-message communitychat-left">
              <img src="/Usericon.png" alt="Sarah" />
              <div className="communitychat-message-content">
                <span className="communitychat-username">Sarah Johnson</span>
                <span className="communitychat-time">10:30 AM</span>
                <p>Hey everyone! Just wanted to share my progress.</p>
              </div>
            </div>

            <div className="communitychat-message communitychat-right">
              <div className="communitychat-message-content">
                <span className="communitychat-time">10:32 AM</span>
                <span className="communitychat-username">You</span>
                <p>Looks amazing, Sarah! The color scheme is perfect.</p>
              </div>
              <img src="/Usericon.png" alt="You" />
            </div>

            <div className="communitychat-message communitychat-left">
              <img src="/Usericon.png" alt="Mike" />
              <div className="communitychat-message-content">
                <span className="communitychat-username">Mike Chen</span>
                <span className="communitychat-time">10:35 AM</span>
                <p>I’ve added some comments on the Figma file.</p>
                <div className="communitychat-file">
                  <FaFileAlt />
                  <span>Project_Feedback.pdf (2.3 MB)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="communitychat-input">
            <button className="communitychat-attach">
              <FaPaperclip />
            </button>
            <input type="text" placeholder="Type your message..." />
            <button className="communitychat-send">
              <FaPaperPlane />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="communitychat-sidebar">
          <div className="communitychat-sidebar-search">
            <FaSearch />
            <input type="text" placeholder="Search members..." />
          </div>
          <div className="communitychat-members">
            <div className="communitychat-member">
              <FaUserCircle />
              <div>
                <p className="communitychat-member-name">Sarah Johnson</p>
                <p className="communitychat-member-status">Online</p>
              </div>
            </div>
            <div className="communitychat-member">
              <FaUserCircle />
              <div>
                <p className="communitychat-member-name">Mike Chen</p>
                <p className="communitychat-member-status">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
