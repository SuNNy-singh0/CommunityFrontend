import React, { useState } from 'react';
import './Login.css';  // Assuming the styles are in a file named style.css
import { useNavigate } from 'react-router-dom';
import { setToken, setUser, setAuthHeader } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleRegisterClick = () => {
    setIsActive(true);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLoginClick = () => {
    setIsActive(false);
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await fetch('http://localhost:8080/rooms/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration Successful');
        setIsActive(false);
      } else {
        alert('Registration Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Try again.');
    }
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log(loginData);
    try {
      const response = await fetch('http://localhost:8080/rooms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token
        setToken(data.token);
        // Store user data
        const userData = {
          username: loginData.username,  // Store the username from login form
          ...data.user  // Spread any additional user data from response
        };
        setUser(userData);
        // Set authorization header
        setAuthHeader(data.token);
        // Redirect to home page
        navigate('/');
      } else {
        alert('Invalid Username or Password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Try again.');
    }
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Function to logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthHeader(null);
    navigate('/login');
  };

  return (
    <div id="login">
    <div className={`container ${isActive ? 'active' : ''}`}>
       {/* Login Form */}
       <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1 className="form-title">Login</h1>
            <div className="input-box">
              <input type="text" name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn2">Login</button>
          </form>
        </div>

      <div className="form-box register" style={{ width: '100%' }}>
          <form onSubmit={handleRegisterSubmit}>
            <h1 className="form-title">Registration</h1>
            <div className="input-box">
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="input-box">
              <input type="tel" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} required />
              <i className="bx bxs-phone"></i>
            </div>
            <button type="submit" className="btn2">Register</button>
          </form>
        </div>
      (isActive && (
        
        <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={handleRegisterClick}>Register</button>
        </div>
        
      ))
      

        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={handleLoginClick}>Login</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
