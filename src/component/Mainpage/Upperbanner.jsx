import React, { useState, useEffect } from 'react'
import './Mainpage.css'
import { MdOutlineLogin } from 'react-icons/md'
import { RiLogoutCircleLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, logout } from '../../utils/auth';

function Upperbanner() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  useEffect(() => {
    const user = getUser();
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUsername(null);
    navigate('/login');
  };

  return (
    <>
      <div className='comnavbar'>
        <div className='logocontainer'>
          <img src='logo.png' className='logoimg' alt="Logo" />
        </div>
        <div className='btncontainer'>
          {isAuthenticated() ? (
            <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'black', fontWeight: 'bold' ,cursor:'pointer'}} onClick={()=>{
                navigate('/profile');
              }}>
                {username || 'User'}
              </span>
              <a href="#" onClick={handleLogout} id="button">
                <span className="top-border"></span>
                <span className="right-border"></span>
                <span className="bottom-border"></span>
                <span className="left-border"></span>
                <RiLogoutCircleLine size={25} color='black' style={{
                  margin: '1px 5px'
                }} />Logout
              </a>
            </div>
          ) : (
            <a href="#" onClick={() => navigate('/login')} id="button">
              <span className="top-border"></span>
              <span className="right-border"></span>
              <span className="bottom-border"></span>
              <span className="left-border"></span>
              <MdOutlineLogin size={25} color='black' style={{
                margin: '1px 5px'
              }} />Login
            </a>
          )}
        </div>
      </div>
      <div className='upperbanner'>
        <img src='community3.jpg' className='bannerimg' alt="Banner" />
      </div>
      <div className='bannerlowerheading'>
        <p>Bridging <span>Great ideas </span>with <span>Good Connection</span></p>
      </div>
    </>
  )
}

export default Upperbanner