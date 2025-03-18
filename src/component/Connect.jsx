import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import "./Connect.css";
import { FaJava } from "react-icons/fa6";
import { MdOutlineAttachment, MdUpdate } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { IoMdExit } from "react-icons/io";
import { getmessages } from "../service/Service";
import { FaUserCircle } from "react-icons/fa";

const baseurl = "http://localhost:8080";

// Avatar configuration
const AVATAR_COUNT = 12; // Number of available avatars
const AVATAR_BASE_PATH = '/avatars/'; // Path to avatar images in public folder

const Connect = () => {
  const naviagate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [communityMembers, setCommunityMembers] = useState([]);
  const fileInputRef = useRef(null);
  const { username, userid } = useParams();
  const [stompClient, setStompClient] = useState(null);
  const inputRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

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

  // Function to get or assign user avatar
  const getUserAvatar = () => {
    const storedAvatar = localStorage.getItem(`userAvatar_${userid}`);
    if (storedAvatar) {
      return storedAvatar;
    }
    
    // Generate random avatar number between 1 and AVATAR_COUNT
    const randomAvatar = Math.floor(Math.random() * AVATAR_COUNT) + 1;
    const avatarPath = `${AVATAR_BASE_PATH}avatar${randomAvatar}.png`;
    
    // Store the avatar in localStorage
    localStorage.setItem(`userAvatar_${userid}`, avatarPath);
    return avatarPath;
  };

  // Initialize user avatar on component mount
  useEffect(() => {
    const avatar = getUserAvatar();
    setUserAvatar(avatar);
  }, [userid]);

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
        <div className="imageMessage">
          <img 
            src={msg.fileUrl} 
            alt={msg.content} 
            style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px' }}
          />
        </div>
      );
    } else if (msg.messageType === 'file') {
      return (
        <div className="fileMessage">
          <span className="fileIcon">📎</span>
          <a 
            href={msg.fileUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="fileLink"
          >
            {msg.content} ({msg.fileSize})
          </a>
        </div>
      );
    }
    return <p className="messageText">{msg.content}</p>;
  };

  return (
    <div className="connectContainer">
      <header className="connectHeader">
        <div className="connectLogo" style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
          <img className="community-logo" src="/logo.png" alt="Logo" />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* <FaJava size={24} color="#E76F00" /> */}
            <h2 style={{ margin: 0 }}>Welcome to Java Community</h2>
          </div>
        </div>
        <div className="connectButtons">
          {/* <button className="latestButton"><MdUpdate size={20}/>Latest Update</button> */}
          <FaUserCircle color='green' size={30}/><span style={{
            margin:'0px 5px',
            fontSize:'18px',
            fontWeight:'500'
          }}>{userid}</span>
          <button className="exitButton" onClick={()=>{
            naviagate('/');
          }}><IoMdExit size={20}/>Exit</button>
        </div>
      </header>
      <div className="connectMain">
        <div className="chatWindow">
          <div className="chatHeader" style={{
            color:'darkgreen',
            fontSize:'20px',
            fontWeight:'500'
          }}>
            <p>Java Contest is at 29 March , 2024 2:00pm </p>
          </div>
          <div className="chatMessages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatMessage ${msg.sender === userid ? 'currentUser' : ''}`}>
                <div className="avatar">
                  <img 
                    src={localStorage.getItem(`userAvatar_${msg.sender}`) || `${AVATAR_BASE_PATH}avatar1.png`} 
                    alt={`${msg.sender}'s avatar`}
                  />
                </div>
                <div className="messageContent">
                  <span className="username">{msg.sender}</span>
                  {renderMessage(msg)}
                </div>
              </div>
            ))}
          </div>
          <div className="chatInputArea">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <span className="attach" onClick={() => fileInputRef.current?.click()}>
              <MdOutlineAttachment size={25}/>
            </span>
            {fileName && (
              <span className="fileName" style={{ margin: '0 10px', fontSize: '14px', color: '#666' }}>
                {fileName}
              </span>
            )}
            <input
              type="text"
              className="messageInput"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={inputRef}
            />
            <button 
              className="sendButton" 
              onClick={selectedFile ? handleFileUpload : handleSendMessage}
            >
              <FiSend size={20}/>Send
            </button>
          </div>
        </div>
        <aside className="onlineUsers">
          <h3>Community Members</h3>
          <div className="userList">
            {communityMembers.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center' }}>No members found</p>
            ) : (
              communityMembers.map((member) => (
                <div key={member.id} className="userItem">
                  <div className="userAvatar">
                    <img 
                      src={localStorage.getItem(`userAvatar_${member.username}`) || `${AVATAR_BASE_PATH}avatar1.png`}
                      alt={`${member.username}'s avatar`}
                    />
                  </div>
                  <div className="userInfo">
                    <span className="userName">{member.username}</span>
                   
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