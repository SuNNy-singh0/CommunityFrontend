import React, { useEffect, useState, useRef } from 'react';
import '../index.css';
import { LuSendHorizontal } from 'react-icons/lu';
import { MdOutlineAttachment } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { baseurL } from '../config/Axioshelper';
import { Client, Stomp } from '@stomp/stompjs';  // Correct import for Stomp Client in v7.x.x
import SockJS from 'sockjs-client';
import { getmessages } from '../service/Service';

function ChatPage() {
  const baseurl = baseurL;
  const [messages, setMessages] = useState([]);
  const { username } = useParams();
  const { userid } = useParams();
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  const [roomId, setRoomId] = useState(username); // Set roomId from username
  const [user, setUser] = useState(userid);

  // Establish WebSocket connection once and handle cleanup
  useEffect(() => {
    if (stompClient) return; // Prevent re-creating WebSocket connection if already established

    const connectWebSocket = () => {
      const sock = new SockJS(`${baseurl}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        console.log("WebSocket connected");

        // Subscribe to the room's topic
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          // Log received message for debugging
          console.log("Received message:", message.body);

          // Parse and update the messages state with the incoming message
          const newMessage = JSON.parse(message.body);

          // Update the message list with the new message
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      });

      setStompClient(client); // Set the stompClient state after establishing connection
    };

    connectWebSocket();

    // Cleanup function to deactivate the WebSocket when the component is unmounted
    return () => {
      if (stompClient) {
        stompClient.deactivate();  // Deactivate WebSocket connection on cleanup
      }
    };
  }, [roomId,stompClient]);  // Only run this effect when the roomId changes

  // Load existing messages when roomId changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getmessages(roomId);  // Fetch messages for the current room
        if (Array.isArray(response)) {
          setMessages(response);  // Set the fetched messages if they are in an array
        } else {
          console.error("Fetched messages are not an array:", response);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    loadMessages();  // Fetch messages when the roomId changes
  }, [roomId]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() !== '' && stompClient) {
      const newMessage = {
        content: input,
        sender: user,
        roomid: roomId
      };

      // Send the message to the WebSocket server
      stompClient.send(`/app/sendmessage/${roomId}/websocket`, {}, JSON.stringify(newMessage));

      // Add the message to local state for instant update (without waiting for server response)
      // setMessages((prevMessages) => [...prevMessages, newMessage]);

      setInput(''); // Clear the input field
      inputRef.current.focus(); // Focus back on the input field
    }
  };

  return (
    <div>
      {/* Part 1 - Room and User Info */}
      <div id="chatpagepart1">
        <div>
          <h3>
            Room id: <span>{username}</span>
          </h3>
        </div>
        <div>
          <h3>
            User: <span>{user}</span>
          </h3>
        </div>
        <div>
          <button className="btn btn-danger">Leave Room</button>
        </div>
      </div>

      {/* Part 2 - Chat Messages */}
      <div className="centerchatpart">
        {messages.map((message, index) => (
          <div
            key={index}
            className="messagecontainer"
            style={{
              justifyContent: message.sender === user ? 'flex-end' : 'flex-start',
            }}
          >
            <div id="single-message">
              <img
                src="https://avatar.iran.liara.run/public"
                id="avatar"
                alt="avatar"
              />
              <div>
                <p className="sender">{message.sender}</p>
                <p className="content">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Part 3 - Message Input */}
      <div id="chatpagepart1" className="lastbox" style={{ marginTop: '10vh' }}>
        <div style={{ flexBasis: '90%', textAlign: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            className="form-control lastinput"
            placeholder="Type Your Message"
            onChange={(e) => setInput(e.target.value)} // Updates input state
            value={input}
          />
        </div>
        <div>
          <h3 id="attach">
            <MdOutlineAttachment />
          </h3>
        </div>
        <div>
          <button className="btn btn-warning" onClick={handleSendMessage}>
            <LuSendHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
