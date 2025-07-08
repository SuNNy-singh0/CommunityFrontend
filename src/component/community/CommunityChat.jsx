import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getmessages } from "../../service/Service";  // Import the service function
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

const baseurl = "http://13.201.100.143:8080";
const AVATAR_COUNT = 12;
const AVATAR_BASE_PATH = '/avatars/';

const CommunityChat = () => {
  const [jobDropdown, setJobDropdown] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { username, userid } = useParams();

  // Fetch community members
  useEffect(() => {
    const fetchCommunityMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseurl}/community/records`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const records = await response.json();
          const filteredMembers = records.filter(record => record.communitytype === username);
          setCommunityMembers(filteredMembers);
        }
      } catch (error) {
        console.error('Error fetching community members:', error);
      }
    };

    fetchCommunityMembers();
  }, [username]);

  // Load initial messages with pagination
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // Using the service function with default pagination (50 messages, page 0)
        const response = await getmessages(username);
        console.log("Messages response:", response);
        
        if (Array.isArray(response)) {
          setMessages(response);
        } else {
          console.error("Fetched messages are not an array:", response);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      }
    };
    if (username) {
      loadMessages();
    }
  }, [username]);

  // WebSocket connection
  const connectWebSocket = () => {
    console.log("Attempting to connect WebSocket...");
    const sock = new SockJS(`${baseurl}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      console.log("WebSocket connected successfully");
      setIsConnected(true);
      client.subscribe(`/topic/room/${username}`, (message) => {
        console.log("Received WebSocket message:", message.body);
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
      setStompClient(client);
    }, (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    });

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setIsConnected(false);
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size should be less than 10MB");
        event.target.value = "";
        return;
      }

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
        event.target.value = "";
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
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
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (response.ok) {
          const uploadedMessage = await response.json();
          console.log("Upload successful:", uploadedMessage);
          
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
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

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

  const handleSendMessage = () => {
    if (message.trim() || selectedFile) {
      if (selectedFile) {
        handleFileUpload();
      } else {
        const newMessage = {
          content: message,
          sender: userid,
          timestamp: new Date().toISOString(),
          type: "TEXT",
          roomId: username
        };
        console.log("Sending message:", newMessage);
        
        // Add message to UI immediately for better UX
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Send through WebSocket
        sendMessageThroughWebSocket(newMessage);
        
        // Clear input
        setMessage("");
      }
    }
  };

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
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`communitychat-message ${
                  msg.sender === userid ? 'communitychat-right' : 'communitychat-left'
                }`}
              >
                {msg.sender !== userid && (
                  <img
                    src={msg.senderAvatar || "/Usericon.png"}
                    alt={msg.sender}
                  />
                )}
                <div className="communitychat-message-content">
                  <span className="communitychat-username">
                    {msg.sender === userid ? 'You' : msg.sender}
                  </span>
                  <span className="communitychat-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  {msg.type === "FILE" ? (
                    <div className="communitychat-file">
                      <FaFileAlt />
                      <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                        {msg.content}
                      </a>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                {msg.sender === userid && (
                  <img
                    src={msg.senderAvatar || "/Usericon.png"}
                    alt="You"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="communitychat-input">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button
              className="communitychat-attach"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaPaperclip />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="communitychat-send"
              onClick={handleSendMessage}
            >
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
            {communityMembers.map((member, index) => (
              <div key={index} className="communitychat-member">
                <FaUserCircle />
                <div>
                  <p className="communitychat-member-name">{member.username}</p>
                  <p className="communitychat-member-status">
                    {member.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
