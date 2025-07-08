import React, { useEffect, useState, useRef } from "react";
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FaReact, FaUserPlus, FaRegSmile, FaRegImage, FaRegPaperPlane, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaCircle, FaUser } from "react-icons/fa";
import "./CommunityChatUniqueXylo.css";
import { useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated, getUser, getToken } from '../../utils/auth';

// Event icon mapping based on community type
const getEventIcon = (communityType) => {
  return <FaReact className="xylo-community-eventicon" style={{ color: '#6B4BFF' }} />;
};

// Event color mapping based on community type
const getEventColor = (communityType) => {
  const colors = {
    'React': 'xylo-community-event-badge-blue',
    'Java': 'xylo-community-event-badge-purple',
    'DSA': 'xylo-community-event-badge-green'
  };
  return colors[communityType] || 'xylo-community-event-badge-blue';
};

const baseurl = "http://13.201.100.143:8080";

const CommunityChatUniqueXylo = () => {
  const navigate = useNavigate();
  const { communityname, username: urlUsername } = useParams();
  const [username, setUsername] = useState(null);
  const [userCommunities, setUserCommunities] = useState([]);
  const [communityEvents, setCommunityEvents] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const user = getUser();
    if (!user || !user.username) {
      navigate('/login');
      return;
    }

    setUsername(user.username);
    // Check if URL username matches logged in user
    if (user.username !== urlUsername) {
      navigate(`/communitychat/${communityname}/${user.username}`);
      return;
    }
    checkUserCommunities(user.username);

    // Initialize WebSocket connection
    const client = connectWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (client) client.disconnect();
    };
  }, [communityname, urlUsername]);

  const checkUserCommunities = async (username) => {
    try {
      const token = getToken();
      console.log('Checking communities for user:', username);
      
      // First, try to get user's communities
      const response = await fetch(`${baseurl}/community/records`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch user communities:', response.status);
        throw new Error(`Failed to fetch communities: ${response.status}`);
      }

      const records = await response.json();
      console.log('All community records:', records);

      // Filter communities for the current user
      const userCommunities = Array.isArray(records) 
        ? records
          .filter(record => record.username === username)
          .map(record => record.communitytype)
        : [];

      console.log('Filtered user communities:', userCommunities);
      setUserCommunities(userCommunities);

      // Check if user is part of this community
      if (userCommunities.includes(communityname)) {
        console.log('User is a member of', communityname);
        fetchCommunityData();
      } else {
        console.log('User is not a member of', communityname);
        alert('You are not a member of this community');
       
      }
    } catch (error) {
      console.error('Error checking user communities:', error);
      alert('Error checking community membership');
      // navigate('/');
    }
  };

  const connectWebSocket = () => {
    const sock = new SockJS(`${baseurl}/ws`);
    const client = Stomp.over(() => new SockJS(`${baseurl}/ws`));

    client.connect({}, () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      client.subscribe(`/topic/room/${communityname}`, (message) => {
        console.log("Received message:", message.body);
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
      setStompClient(client);
    });

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
    };

    return client;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
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

  const sendMessageThroughWebSocket = (message) => {
    if (!stompClient || !isConnected) {
      console.log("WebSocket not connected, attempting to reconnect...");
      connectWebSocket();
      setTimeout(() => {
        if (stompClient && isConnected) {
          stompClient.send(`/app/sendmessage/${communityname}/websocket`, {}, JSON.stringify(message));
        }
      }, 2000);
    } else {
      stompClient.send(`/app/sendmessage/${communityname}/websocket`, {}, JSON.stringify(message));
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('sender', username);

      try {
        const response = await fetch(`${baseurl}/api/chat/${communityname}/upload`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const uploadedMessage = await response.json();
          if (uploadedMessage && uploadedMessage.fileUrl) {
            setSelectedFile(null);
            setFileName("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setMessages(prevMessages => [...prevMessages, uploadedMessage]);
            sendMessageThroughWebSocket(uploadedMessage);
          } else {
            console.error("Invalid uploaded message:", uploadedMessage);
          }
        } else {
          const errorData = await response.text();
          console.error("Upload failed:", errorData);
          alert("Failed to upload file. Please try again.");
        }
      } catch (error) {
        console.error("Network error during upload:", error);
        alert("Network error occurred. Please check your connection and try again.");
      }
    }
  };

  const handleSendMessage = () => {
    if (selectedFile) {
      handleFileUpload();
      return;
    }
  
    if (message.trim() === "") return;
    
    const newMessage = {
      content: message,
      sender: username,
      roomid: communityname,
    };
    sendMessageThroughWebSocket(newMessage);
    setMessage("");
    if (inputRef.current) inputRef.current.focus();
  };

  const renderMessage = (msg) => {
    if (msg.messageType === 'image') {
      return (
        <div className="xylo-message-image">
          <img 
            src={msg.fileUrl} 
            alt={msg.content} 
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
          />
        </div>
      );
    } else if (msg.messageType === 'file') {
      return (
        <div className="xylo-message-file">
          <a 
            href={msg.fileUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="xylo-file-link"
          >
            {msg.content}
          </a>
        </div>
      );
    }
    return <p className="xylo-message-text">{msg.content}</p>;
  };

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Fetch messages
      const messagesResponse = await fetch(`${baseurl}/api/chat/${communityname}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (messagesResponse.ok) {
        const messages = await messagesResponse.json();
        setMessages(messages || []);
      } else {
        console.error('Failed to fetch messages:', await messagesResponse.text());
        // Set default welcome message if no messages
        setMessages([
          {
            sender: username || 'You',
            content: 'Welcome to React Community Chat!',
            timestamp: new Date().toISOString(),
            avatarColor: 'xylo-community-avatar-purple'
          }
        ]);
      }

      // Set default active user if no other data
      setActiveUsers([
        { username: username || 'You', isActive: true, avatarColor: 'xylo-community-avatar-purple' }
      ]);

    } catch (error) {
      console.error('Error fetching community data:', error);
      // Set default data on error
      setMessages([
        {
          sender: username || 'You',
          content: 'Welcome to React Community Chat!',
          timestamp: new Date().toISOString(),
          avatarColor: 'xylo-community-avatar-purple'
        }
      ]);
      setActiveUsers([
        { username: username || 'You', isActive: true, avatarColor: 'xylo-community-avatar-purple' }
      ]);
    } finally {
      setLoading(false);
    }
  };


  const handleJoinCommunity = async (communityName) => {
    if (!isAuthenticated()) {
      alert('Please login first to join the community');
      navigate('/login');
      return;
    }

    try {
      const token = getToken();
      const response = await fetch('http://13.201.100.143:8080/community/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          communitytype: communityName
        })
      });

      if (response.ok) {
        setUserCommunities([...userCommunities, communityName]);
        navigate(`/Connect/${communityName}/${username}`);
      } else {
        const errorText = await response.text();
        if (errorText.includes("User is already a member of this community")) {
          navigate(`/Connect/${communityName}/${username}`);
        } else {
          alert(errorText || 'Failed to join community');
        }
      }
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Something went wrong while joining the community');
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="xylo-community-root">
      {/* Header */}
      <div className="xylo-community-header">
        <div className="xylo-community-header-left">
          <span className="xylo-community-header-logo"><FaReact /></span>
          <span className="xylo-community-header-title">React Community Chat</span>
        </div>
        <button className="xylo-community-job-btn" onClick={() => handleJoinCommunity('React')}>Join Community</button>
        <div className="xylo-community-header-right">
          <span className="xylo-community-header-avatar"><FaUser /></span>
          <span className="xylo-community-header-logout" onClick={handleLogout}><FaSignOutAlt /></span>
        </div>
      </div>
      {/* Events Strip */}
      <div className="xylo-community-events-strip">
        <div className="xylo-community-events-strip-header">
          <span className="xylo-community-events-strip-title">Upcoming Events</span>
          <div className="xylo-community-events-strip-arrows">
            <button className="xylo-community-events-arrow"><FaChevronLeft /></button>
            <button className="xylo-community-events-arrow"><FaChevronRight /></button>
          </div>
        </div>
        <div className="xylo-community-events-list">
          {loading ? (
            <div className="xylo-community-loading">Loading events...</div>
          ) : communityEvents.map((event, idx) => (
            <div className="xylo-community-event-card" key={idx}>
              <div className={`xylo-community-event-badge ${event.color}`}>{event.icon}<span>{event.label}</span></div>
              <div className="xylo-community-event-title">{event.title}</div>
              <div className="xylo-community-event-date">{event.eventDate}</div>
              <div className="xylo-community-event-tags">
                {event.tags?.map((tag, i) => (
                  <span className="xylo-community-event-tag" key={i}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main Chat and Users */}
      <div className="xylo-community-main">
        {/* Chat Panel */}
        <div className="xylo-community-chat-panel">
          <div className="xylo-community-chat-header">
            <span className="xylo-community-chat-title">React General Discussion</span>
            <span className="xylo-community-chat-online">32 online</span>
            <span className="xylo-community-chat-search"><FaRegSmile /></span>
          </div>
          <div className="xylo-community-chat">
            <div className="xylo-community-messages">
              {loading ? (
                <div className="xylo-community-loading">Loading messages...</div>
              ) : messages.map((message, idx) => (
                <div 
                  className={`xylo-community-message ${message.sender === username ? 'right' : 'left'}`} 
                  key={idx}
                >
                  <div className={`xylo-community-message-avatar ${message.avatarColor || 'xylo-community-avatar-blue'}`}>
                    <FaUser />
                  </div>
                  <div className="xylo-community-message-content">
                    <div className="xylo-community-message-header">
                      <span className="xylo-community-message-user">{message.sender}</span>
                      <span className="xylo-community-message-time">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="xylo-community-message-text">{message.content}</div>
                    {message.imageUrl && (
                      <div className="xylo-community-message-image">
                        <img src={message.imageUrl} alt="" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="xylo-community-chat-date-divider">Today, 10:50 AM</div>
            </div>
          </div>
          <div className="xylo-community-chat-inputrow">
            <span className="xylo-community-chat-emoji"><FaRegSmile /></span>
            <span className="xylo-community-chat-image"><FaRegImage /></span>
            <input 
              type="text" 
              placeholder="Type your message..." 
              disabled={!username}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setMessages([...messages, {
                    sender: username,
                    content: e.target.value.trim(),
                    timestamp: new Date().toISOString(),
                    avatarColor: 'xylo-community-avatar-purple'
                  }]);
                  e.target.value = '';
                }
              }}
            />
            <button className="xylo-community-chat-send"><FaRegPaperPlane /></button>
          </div>
        </div>
        {/* Users Panel */}
        <div className="xylo-community-users-panel">
          <div className="xylo-community-chat-container">
            <div className="xylo-community-users-list">
              <div className="xylo-community-users-header">
                <span>Community Members</span>
                <FaUserPlus className="xylo-community-add-user" />
              </div>
              {loading ? (
                <div className="xylo-community-loading">Loading users...</div>
              ) : activeUsers.map((user, idx) => (
                <div className="xylo-community-user-item" key={idx}>
                  <div className={`xylo-community-user-avatar ${user.avatarColor || 'xylo-community-avatar-blue'}`}>
                    <FaUser />
                    {user.isActive && <FaCircle className="xylo-community-user-status" />}
                  </div>
                  <div className="xylo-community-user-info">
                    <span className="xylo-community-user-name">{user.username}</span>
                    <span className="xylo-community-user-status-text">{user.isActive ? 'Active now' : 'Offline'}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="xylo-community-users-invite"><FaUserPlus /> Invite Members</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChatUniqueXylo;
