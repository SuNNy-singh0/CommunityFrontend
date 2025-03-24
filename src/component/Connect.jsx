import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import "./Connect.css";
import {
  FaBriefcase,
  FaBell,
  FaCalendar,
  FaClock,
  FaPaperclip,
  FaPaperPlane,
  FaSearch,
  FaFileAlt,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdOutlineAttachment } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { getmessages } from "../service/Service";

const baseurl = "http://localhost:8080";

const Connect = () => {
  const naviagate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [communityMembers, setCommunityMembers] = useState([]);
  const fileInputRef = useRef(null);
  const { username, userid } = useParams();
  const [stompClient, setStompClient] = useState(null);
  const inputRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const [contests, setContests] = useState([]);
  const [showJobsPopup, setShowJobsPopup] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});

  // Fetch community members
  useEffect(() => {
    const fetchCommunityMembers = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        console.log('Fetching community members from:', `${baseurl}/community/records`);
        
        const response = await fetch(`${baseurl}/community/records`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const records = await response.json();
          console.log('All records:', records);
          
          // Filter members based on community type
          const filteredMembers = records.filter(record => {
            console.log('Checking record:', record);
            console.log('Community type:', record.communitytype);
            console.log('Username:', username);
            return record.communitytype === username;
          });
          
          console.log('Filtered members:', filteredMembers);
          setCommunityMembers(filteredMembers);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch community members:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          });
        }
      } catch (error) {
        console.error('Error fetching community members:', error);
        console.error('Error details:', error.message);
      }
    };

    fetchCommunityMembers();
  }, [username]);

  // Add contest fetching effect
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${baseurl}/contests/all`);
        if (response.ok) {
          const allContests = await response.json();
          // Filter contests for current community only (not including null/global contests)
          const communityContests = allContests.filter(contest => 
            contest.communitytype === username
          );
          setContests(communityContests);
        } else {
          console.error("Failed to fetch contests");
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, [username]);

  // Add jobs fetching function
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${baseurl}/jobs/all`);
      if (response.ok) {
        const allJobs = await response.json();
        // Filter jobs for current community
        const communityJobs = allJobs.filter(job => job.communitytype === username);
        setJobs(communityJobs);
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Update profile pictures fetching effect
  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await fetch(`${baseurl}/usercontrol/user-pics`);
        if (response.ok) {
          const profiles = await response.json();
          // Convert array to object for easier lookup
          const profileMap = {};
          profiles.forEach(profile => {
            // Only add to map if profilePicUrl is not empty
            profileMap[profile.name] = profile.profilePicUrl || "/profile.png";
          });
          setUserProfiles(profileMap);
        } else {
          console.error("Failed to fetch user profiles");
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUserProfiles();
  }, []);

  // Helper function to get user profile picture
  const getUserProfilePic = (username) => {
    return userProfiles[username] || "/profile.png";
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert("File size should be less than 10MB");
        event.target.value = ""; // Clear the input
        return;
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert("File type not supported. Please select an image, PDF, or Word document.");
        event.target.value = ""; // Clear the input
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const connectWebSocket = () => {
    const sock = new SockJS(`${baseurl}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      client.subscribe(`/topic/room/${username}`, (message) => {
        console.log("Received message:", message.body);
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
      setStompClient(client);
    });

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
    };

    return client;
  };

  useEffect(() => {
    const client = connectWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (client) client.disconnect();
    };
  }, [username]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getmessages(username);
        if (Array.isArray(response)) {
          setMessages(response);
        } else {
          console.error("Fetched messages are not an array:", response);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages(); 
  }, [username]);

  const sendMessageThroughWebSocket = (message) => {
    if (!stompClient || !isConnected) {
      console.log("WebSocket not connected, attempting to reconnect...");
      connectWebSocket();
      // Retry sending after 2 seconds
      setTimeout(() => {
        if (stompClient && isConnected) {
          stompClient.send(`/app/sendmessage/${username}/websocket`, {}, JSON.stringify(message));
        }
      }, 2000);
    } else {
      stompClient.send(`/app/sendmessage/${username}/websocket`, {}, JSON.stringify(message));
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('sender', userid);

      try {
        console.log("Uploading file:", {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          roomId: username,
          sender: userid
        });

        const response = await fetch(`${baseurl}/api/chat/${username}/upload`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const uploadedMessage = await response.json();
          console.log("Upload successful:", uploadedMessage);
          
          // Ensure the uploaded message is valid
          if (uploadedMessage && uploadedMessage.fileUrl) {
            // Clear the file input first
            setSelectedFile(null);
            setFileName("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            // Add the message to the messages state immediately
            setMessages(prevMessages => [...prevMessages, uploadedMessage]);
            
            // Send the message through WebSocket
            sendMessageThroughWebSocket(uploadedMessage);

            // Reload messages after a short delay to ensure the image is processed
            setTimeout(async () => {
              try {
                const response = await getmessages(username);
                if (Array.isArray(response)) {
                  setMessages(response);
                } else {
                  console.error("Fetched messages are not an array:", response);
                }
              } catch (error) {
                console.error("Error reloading messages:", error);
              }
            }, 1000); // Wait 1 second before reloading
          } else {
            console.error("Invalid uploaded message:", uploadedMessage);
          }
        } else {
          const errorData = await response.text();
          console.error("Upload failed with status:", response.status);
          console.error("Error details:", errorData);
          
          if (errorData.includes("Google Cloud Storage")) {
            alert("File upload failed: Storage service is not properly configured. Please try again later.");
          } else if (response.status === 413) {
            alert("File is too large. Please select a smaller file.");
          } else if (response.status === 415) {
            alert("File type not supported. Please select a different file.");
          } else {
            alert("Failed to upload file. Please try again later.");
          }
        }
      } catch (error) {
        console.error("Network error during upload:", error);
        alert("Network error occurred. Please check your connection and try again.");
      }
    }
  };

  const handleSendMessage = () => {
    if (selectedFile) {
      handleFileUpload(); // If a file is selected, upload it instead of sending an empty text message
      return;
    }
  
    if (message.trim() === "") return; // Return early if message is empty
    
    const newMessage = {
      content: message,
      sender: userid,
      roomid: username,
    };
    sendMessageThroughWebSocket(newMessage);
    setMessage("");
    inputRef.current.focus();
  };

  const renderMessage = (msg) => {
    if (msg.messageType === 'image') {
      return (
        <div className="message-image">
          <img 
            src={msg.fileUrl} 
            alt={msg.content} 
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
          />
        </div>
      );
    } else if (msg.messageType === 'file') {
      return (
        <div className="message-file">
          <FaFileAlt className="file-icon" />
          <a 
            href={msg.fileUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="file-link"
          >
            {msg.content}
          </a>
        </div>
      );
    }
    return <p className="message-text">{msg.content}</p>;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date helper function
  const formatJobDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Jobs popup component
  const JobsPopup = () => {
    if (!showJobsPopup) return null;

    return (
      <div className="jobs-popup-overlay">
        <div className="jobs-popup">
          <div className="jobs-popup-header">
            <h2>Job Opportunities - {username} Community</h2>
            <button className="btn btn-dark" onClick={()=>{
              naviagate('/jobboard')
            }}>See all jobs</button>
            <button className="close-button" onClick={() => setShowJobsPopup(false)}>
              <FaTimes />
            </button>
            
          </div>
          <div className="jobs-popup-content">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job.id} className="job-card">
                  {job.postimagelink && (
                    <div className="job-image">
                      {/* <img src={job.postimagelink} alt="Job post" /> */}
                    </div>
                  )}
                  <div className="job-details">
                    <div className="job-header">
                      <div className="job-tags">
                        {job.tag.filter(tag => tag).map((tag, index) => (
                          <span key={index} className="job-tag">#{tag}</span>
                        ))}
                      </div>
                      <span className="job-date">{formatJobDate(job.date)}</span>
                    </div>
                    <p className="job-description">{job.description}</p>
                    {job.sourcelink && (
                      <a 
                        href={job.sourcelink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        View Source <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-jobs">
                <p>No job opportunities available for {username} community at the moment.</p>
                <p>Please check back later!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="communitychat-container">
      <header className="communitychat-header">
        <div className="header-left">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h2>{username} Community</h2>
        </div>
        <div className="header-right">
          <button 
            className="job-button" 
            onClick={() => {
              fetchJobs();
              setShowJobsPopup(true);
            }}
          >
            <FaBriefcase size={16} />
            Job Opportunities
          </button>
          <div className="user-info">
            <img 
              src={getUserProfilePic(userid)}
              alt={userid} 
              style={{
                width:'40px',
                height:'40px'
              }}
            />
            <span>{userid}</span>
          </div>
          <button className="exit-button" onClick={() => naviagate('/')}>
            <IoMdExit size={20} />
            Exit
          </button>
        </div>
      </header>

      {/* Add JobsPopup component */}
      <JobsPopup />

      <div className="communitychat-contests">
        {contests.length > 0 ? (
          contests.map((contest) => (
            <div key={contest.id} className="communitychat-contest">
              <div className="communitychat-contest-content">
                <div className="communitychat-contest-header">
                  <span>Upcoming Contest</span>
                  <span className="contest-type">
                    {contest.communitytype} Community
                  </span>
                </div>
                <p className="communitychat-contest-title">{contest.heading}</p>
                <p className="communitychat-contest-description">
                  {contest.description}
                </p>
                <div className="communitychat-contest-details">
                  <span>
                    <FaCalendar /> {formatDate(contest.date)}
                  </span>
                  <span>
                    <FaClock /> {formatTime(contest.time)}
                  </span>
                  <span>
                    <FaClock /> Duration: {contest.duration} minutes
                  </span>
                  <span className={`communitychat-contest-level ${contest.difficultyLevel.toLowerCase()}`}>
                    {contest.difficultyLevel}
                  </span>
                </div>
                <div className="communitychat-contest-prizes">
                  <p>Prizes:</p>
                  <p>{contest.prizes}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="communitychat-no-contests">
            <div className="no-contests-content">
              <FaCalendar size={40} />
              <h3>No Contests Available</h3>
              <p>There are currently no contests scheduled for the {username} community.</p>
              <p>Please stay tuned for upcoming contests!</p>
            </div>
          </div>
        )}
      </div>

      <div className="communitychat-main">
        
        <div className="communitychat-chat">
          {/* <div className="chat-header">
            <div className="announcement">
              <FaCalendar size={20} />
              <p>Java Contest is at 29 March, 2024 2:00pm</p>
            </div>
          </div> */}

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`communitychat-message ${msg.sender === userid ? 'communitychat-right' : ''}`}
              >
                <div className="message-avatar">
                  <img 
                    src={getUserProfilePic(msg.sender)}
                    alt={`${msg.sender}'s avatar`}
                  />
                </div>
                <div className="communitychat-message-content">
                  <div className="message-header">
                    <span className="sender-name">{msg.sender}</span>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {renderMessage(msg)}
                </div>
              </div>
            ))}
          </div>

          <div className="communitychat-input">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button className="attach-button" onClick={() => fileInputRef.current?.click()}>
              <FaPaperclip size={20} />
            </button>
            {fileName && (
              <span className="file-name">{fileName}</span>
            )}
            <input
              type="text"
              className="message-input"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={inputRef}
            />
            <button 
              className="communitychat-send"
              onClick={selectedFile ? handleFileUpload : handleSendMessage}
            >
              <FaPaperPlane size={16} />
              Send
            </button>
          </div>
        </div>

        <aside className="communitychat-sidebar">
          <h3>Community Members</h3>
          <div className="member-list">
            {communityMembers.length === 0 ? (
              <p className="no-members">No members found</p>
            ) : (
              communityMembers.map((member) => (
                <div key={member.id} className="communitychat-member">
                  <div className="member-avatar">
                    <img 
                      src={getUserProfilePic(member.username)}
                      alt={`${member.username}'s avatar`}
                    />
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.username}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Connect;