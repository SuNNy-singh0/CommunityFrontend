import React, { useEffect, useState } from 'react';
import './Community.css';
import { FaCode, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaJava } from "react-icons/fa6";
import { FaUsers, FaBook } from 'react-icons/fa';
import { FaReact } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { RiLoginCircleLine, RiLogoutCircleLine } from 'react-icons/ri';
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, logout, getToken } from '../utils/auth';
// import { FaCode } from "react-icons/fa";
const CommunityMain = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);

  useEffect(() => {
    const user = getUser();
    if (user && user.username) {
      setUsername(user.username);
      checkUserCommunities(user.username);
    }
  }, []); 

  const checkUserCommunities = async (username) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8080/community/user/${username}/communities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserCommunities(data || []);
      }
    } catch (error) {
      console.error('Error checking user communities:', error);
    }
  };

  const joincommunity = async (communityname) => {
    if (!isAuthenticated()) {
      alert('Please login first to join the community');
      navigate('/login');
      return;
    }

    try {
      const token = getToken();
      const response = await fetch('http://localhost:8080/community/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          communitytype: communityname
        })
      });

      if (response.ok) {
        // Successfully joined the community
        setUserCommunities([...userCommunities, communityname]);
        navigate(`/Connect/${communityname}/${username}`);
      } else {
        const errorText = await response.text();
        if (errorText.includes("User is already a member of this community")) {
          navigate(`/Connect/${communityname}/${username}`);
        } else {
          alert(errorText || 'Failed to join community');
        }
      }
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Something went wrong while joining the community');
    }
  }

  const renderCommunityCard = (name, icon, description) => {
    const isUserInCommunity = userCommunities.includes(name);
    
    return (
      <div className="community-tech-card">
        {icon}
        <h3 className="community-tech-card-title">{name} Community</h3>
        <p className="community-tech-card-description">{description}</p>
        <button 
          className={`curved-button ${isUserInCommunity ? 'active' : ''}`}
          style={{ 
            opacity: isUserInCommunity ? 1 : 0.9,
            cursor: 'pointer',
            backgroundColor: isUserInCommunity ? '#4CAF50' : undefined
          }}
          onClick={() => joincommunity(name)}
        >
          <span className="button-text">
            {isUserInCommunity ? 'Enter Community' : 'Join Community'}
          </span>
          <span className="corner-ribbon"></span>
        </button>
      </div>
    );
  };

  return (
    <div className="community-container">
      <nav className="community-nav">
        <div className="community-nav-content">
          <div className="community-logo-container">
            <img className="community-logo" src="/logo.png" alt="Logo" />
          </div>
         
          <div className="community-nav-actions">
            {isAuthenticated() ? (
              <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'black', fontWeight: 'bold' }}>
                  {username || 'User'}
                </span>
                <button 
                  className="custom-button" 
                  onClick={() => {
                    logout();
                    setUsername(null);
                    navigate('/login');
                  }}
                >
                  <span className="icon-section">
                    <RiLogoutCircleLine size={25} className='icon' style={{
                      color: 'black'
                    }}/>
                  </span>
                  <span className="text-section">Logout</span>
                </button>
              </div>
            ) : (
              <button className="custom-button" onClick={()=>{
                navigate('/login')
              }}>
                <span className="icon-section">
                  <RiLoginCircleLine size={25} className='icon' style={{
                    color:'black'
                  }}/>
                </span>
                <span className="text-section">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="community-main">
        <section className="community-hero-section">
          <div className="community-hero-content">
            <div className="community-hero-text">
              <h1 className="community-hero-heading">
                <span>Uniting Engineers to</span>
                <span className="community-highlight-text">Learn, Compete, and Grow</span>
              </h1>
              <p className="community-hero-description">
                Join our community of passionate engineers. Participate in coding contests, get mentorship, and access premium learning resources.
              </p>
              <div className="community-buttons-container">
                <a href="#" className="community-button community-get-started-btn">Explore Community</a>
                
              </div>
            </div>
            <div className="community-hero-image-container">
              <img src="/mainphoto.jpg" alt="Hero" className="community-hero-image" />
            </div>
          </div>
        </section>

        <section className="community-reasons-section">
          <div className="community-section-header">
            <h2 className="community-section-title">Why Join Asli Engineer Community?</h2>
            <p className="community-section-description">Everything you need to excel in your engineering journey</p>
          </div>

          <div className="community-card-container">
            <div className="community-card">
              <div className="community-card-icon">
              <FaCode size={50} />
              </div>
              <h3 className="community-card-title">Coding Contests</h3>
              <p className="community-card-description">Weekly contests to test your skills and rise up the leaderboard</p>
              
            </div>
            <div className="community-card">
              <div className="community-card-icon">
              <FaUsers size={50} className="community-icon" />
              </div>
              <h3 className="community-card-title">Expert Mentorship</h3>
              <p className="community-card-description">Get guidance from experienced professionals in your domain</p>
             
            </div>
            <div className="community-card">
              <div className="community-card-icon">
              <FaBook size={50} className="community-icon" />
              </div>
              <h3 className="community-card-title">Learning Resources</h3>
              <p className="community-card-description">Access curated content and materials to aid your learning</p>
             
            </div>
          </div>
        </section>

        <section className="community-tech-communities-section">
          <div className="community-section-header">
            <h2 className="community-section-title">Join Our Tech Communities</h2>
            <p className="community-section-description">Connect with like-minded engineers in your domain</p>
          </div>

          <div className="community-tech-card-container">
            {renderCommunityCard('Java', <FaJava size={50}/>, 'Join discussions on Java development, Spring framework, and enterprise applications')}
            {renderCommunityCard('MERN', <FaReact size={50}/>, 'Explore MongoDB, Express.js, React, and Node.js development')}
            {renderCommunityCard('DSA', <FaCode size={50}/>, 'Master Data Structures and Algorithms with our expert community')}
          </div>
        </section>

        <section className="community-cta-section">
          <div className="community-cta-content">
            <h2 className="community-cta-heading">Ready to Start Your Journey?</h2>
            <p className="community-cta-description">Join thousands of engineers who are already part of our community</p>
            <button className="community-button community-cta-btn">Get Started Now</button>
          </div>
        </section>
      </main>

       <footer className="community-footer">
       
        <div className='connecticon'>
          <h1>Connect with us </h1>
          <div style={{
            display:'flex',
            flexDirection:'row',
            gap:'0px 10px'
          }}
          className='comicon'>
          <li><FaLinkedin size={30} style={{
            
          }}/></li> <li><FaInstagram size={30} style={{
           
          }}/></li>
           <li><FaYoutube size={30} style={{
          
          }}/></li>
          <li><FaFacebookF size={30} style={{
           
          }}/></li>
          </div>
        </div>
        <div className="community-footer-bottom">
          <p className="community-footer-text">&copy; 2024 AsII Engineer. All rights reserved.</p>
        </div>
      </footer> 
    </div>
  );
};

export default CommunityMain;
