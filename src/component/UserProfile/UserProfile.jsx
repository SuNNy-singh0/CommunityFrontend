import React, { useState, useEffect } from "react";
import { getUser } from '../../utils/auth';
import {
  FaBell,
  FaMoon,
  FaHome,
  FaChartLine,
  FaCode,
  FaUsers,
  FaCog,
  FaGithub,
  FaLinkedin,
  FaCodeBranch,
  FaCheck,
  FaTrophy,
  FaEdit,
  FaFilePdf,
  FaUpload,
  FaDownload
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import './Userstyle.css'; // Import CSS

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    description: '',
    resumeUrl: '',
    profilePicUrl: '',
    lastContest: '',
    monthlyPerformance: 0,
    linkedin: '',
    github: '',
    skills: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingResume, setUploadingResume] = useState(false);
  
  // Get username from auth utility
  const user = getUser();
  const username = user?.username;

  useEffect(() => {
    if (username) {
      fetchUserDetails(username);
    } else {
      console.error('No username found');
      setLoading(false);
    }
  }, [username]);

  const fetchUserDetails = async (currentUsername) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/usercontrol/${currentUsername}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/usercontrol/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userDetails)
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = type === 'resume' ? 'upload-resume' : 'upload-profile-pic';
      const response = await fetch(`http://localhost:8080/usercontrol/${username}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        alert(`${type === 'resume' ? 'Resume' : 'Profile picture'} uploaded successfully!`);
        fetchUserDetails(username); // Refresh user details
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !userDetails.skills.includes(newSkill.trim())) {
      setUserDetails({
        ...userDetails,
        skills: [...userDetails.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserDetails({
      ...userDetails,
      skills: userDetails.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
      alert('Please upload a PDF or Word document');
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:8080/usercontrol/${username}/upload-resume`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        alert('Resume uploaded successfully!');
        fetchUserDetails(username); // Refresh user details
      } else {
        alert('Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error uploading resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleResumeDownload = async () => {
    if (!userDetails.resumeUrl) {
      alert('No resume available');
      return;
    }

    try {
      // For Google Cloud Storage URLs, open in new tab instead of downloading
      if (userDetails.resumeUrl.includes('storage.googleapis.com')) {
        window.open(userDetails.resumeUrl, '_blank');
        return;
      }

      // For other URLs, try to download
      const response = await fetch(userDetails.resumeUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${username}_resume${userDetails.resumeUrl.substring(userDetails.resumeUrl.lastIndexOf('.'))}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download resume');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      // If download fails, try opening in new tab
      window.open(userDetails.resumeUrl, '_blank');
    }
  };

  const getTruncatedFilename = (url) => {
    if (!url) return '';
    // Extract filename from Google Cloud Storage URL
    if (url.includes('storage.googleapis.com')) {
      const filename = url.split('/').pop().split('?')[0];
      if (filename.length <= 20) return filename;
      
      const extension = filename.slice(filename.lastIndexOf('.'));
      const name = filename.slice(0, filename.lastIndexOf('.'));
      return name.slice(0, 15) + '...' + extension;
    }
    
    // Handle regular URLs
    const filename = url.split('/').pop();
    if (filename.length <= 20) return filename;
    
    const extension = filename.slice(filename.lastIndexOf('.'));
    const name = filename.slice(0, filename.lastIndexOf('.'));
    return name.slice(0, 15) + '...' + extension;
  };

  const performanceData = [
    { day: "1", score: 820 },
    { day: "5", score: 932 },
    { day: "10", score: 901 },
    { day: "15", score: 934 },
    { day: "20", score: 1290 },
    { day: "25", score: 1330 },
    { day: "30", score: 1320 },
  ];
  const recentActivities = [
    {
      icon: <FaCodeBranch className="activity-icon branch-icon" />,
      title: "Merged Pull Request",
      description: "Feature: Add new authentication system",
      time: "2 hours ago",
    },
    {
      icon: <FaCheck className="activity-icon check-icon" />,
      title: "Completed Challenge",
      description: "Advanced Algorithm: Dynamic Programming",
      time: "5 hours ago",
    },
    {
      icon: <FaTrophy className="activity-icon trophy-icon" />,
      title: "Achievement Unlocked",
      description: "100 Days Coding Streak",
      time: "1 day ago",
    },
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!username) {
    return <div className="error">Please log in to view your profile</div>;
  }

  return (
    <div className="dashboardContainer">
     

      {/* Main Content */}
      <div className="mainContent">
        {/* Header */}
        <header className="header">
          <h2 className="headerTitle">Developer Dashboard</h2>
          <div className="headerIcons">
            <FaBell className="icon" />
            <FaMoon className="icon" />
            <div className="profileInfo">
              <img 
                src={userDetails.profilePicUrl || "/community.jpg"} 
                alt="Profile" 
                style={{
                  margin: '0px 10px',
                  width: '20%',
                  borderRadius: '50px'
                }}
                className="profileImage" 
              />
              <span className="profileName">{userDetails.name}</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <main className="contentGrid">
          {/* Performance Chart */}
          <div className="chartContainer">
            <h3 className="sectionTitle">Monthly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[{ day: "Current", score: userDetails.monthlyPerformance }]}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
              {/* Recent Activity */}
           <div className="activity-container">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div className="activity-item" key={index}>
                  <div className="activity-icon-wrapper">{activity.icon}</div>
                  <div className="activity-details">
                    <h4 className="activity-title">{activity.title}</h4>
                    <p className="activity-description">{activity.description}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          </div>
           
          {/* Profile Section */}
          <div className="profileCard">
            <div className="profileHeader">
              <h3 className="sectionTitle">Profile</h3>
              <button onClick={() => setIsEditing(!isEditing)} className="editButton">
                <FaEdit /> {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="profilePicSection">
              <img 
                src={userDetails.profilePicUrl || "/community.jpg"} 
                alt="Profile" 
                className="profilePic" 
              />
              {isEditing && (
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'profile')}
                  accept="image/*"
                  className="fileInput"
                />
              )}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={userDetails.name}
                onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                className="editInput"
              />
            ) : (
              <h4 className="profileName">{userDetails.name}</h4>
            )}

            {isEditing ? (
              <textarea
                value={userDetails.description}
                onChange={(e) => setUserDetails({...userDetails, description: e.target.value})}
                className="editTextarea"
                placeholder="Add your description"
              />
            ) : (
              <p className="profileRole">{userDetails.description}</p>
            )}

            <div className="socialLinks">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={userDetails.github}
                    onChange={(e) => setUserDetails({...userDetails, github: e.target.value})}
                    placeholder="GitHub URL"
                    className="editInput"
                  />
                  <input
                    type="text"
                    value={userDetails.linkedin}
                    onChange={(e) => setUserDetails({...userDetails, linkedin: e.target.value})}
                    placeholder="LinkedIn URL"
                    className="editInput"
                  />
                </>
              ) : (
                <>
                  <a href={userDetails.github} className="socialButton" target="_blank" rel="noopener noreferrer">
                    <FaGithub /> GitHub
                  </a>
                  <a href={userDetails.linkedin} className="socialButton" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin /> LinkedIn
                  </a>
                </>
              )}
            </div>

            <div className="skillsSection">
              <h3 className="sectionTitle">Skills</h3>
              {isEditing && (
                <div className="addSkillSection">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="editInput"
                  />
                  <button onClick={handleAddSkill} className="addSkillButton">Add</button>
                </div>
              )}
              <div className="skillsList">
                {userDetails.skills.map((skill, index) => (
                  <span key={index} className="skill">
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="removeSkillButton"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
               {/* Resume Section */}
           <div className="resume-card">
            <h3 className="section-title">Resume</h3>
            <div className="resume-content">
              {userDetails.resumeUrl ? (
                <>
                  <div className="current-resume">
                    <FaFilePdf className="resume-icon" />
                    <span 
                      className="resume-filename"
                      title={userDetails.resumeUrl.split('/').pop()}
                    >
                      {getTruncatedFilename(userDetails.resumeUrl)}
                    </span>
                    <button 
                      className="download-button"
                      onClick={handleResumeDownload}
                      title="Download Resume"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </>
              ) : (
                <p className="no-resume">No resume uploaded yet</p>
              )}
            </div>
            
            <div className="resume-upload">
              <input
                type="file"
                id="resume-upload"
                onChange={handleResumeUpload}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="resume-upload" 
                className="resume-upload-button"
                disabled={uploadingResume}
              >
                <FaUpload className="upload-icon" />
                {uploadingResume ? 'Uploading...' : 'Upload New Resume'}
              </label>
            </div>
          </div>
            </div>

            {isEditing && (
              <button onClick={handleUpdateDetails} className="saveButton">
                Save Changes
              </button>
            )}
          </div>

         
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
