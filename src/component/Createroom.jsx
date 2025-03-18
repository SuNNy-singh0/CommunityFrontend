import React, { useState } from 'react';
import '../index.css';
import { createroomapi, joinroomapi } from '../service/Service';
import { useNavigate } from 'react-router-dom';

function Createroom() {
  const [roomName, setRoomName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const handleRoomNameChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleTermsChange = () => {
    setTermsAccepted(!termsAccepted);
  };

  const handleCreateRoom = async(e) => {
    e.preventDefault();
    try{
      const response =  await createroomapi(roomName)
      alert("created Sucessfully");
      navigate(`/chat/${roomId}`)
      console.log(response)
    }
    catch(error){
      if(error.status==400){
        alert("room already exist")
      }
      console.log(error)
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    try{
     const response =  await joinroomapi(roomName);
     navigate(`/chat/${response.data.roomId}/${roomId}`)
     console.log(response)
    }
    catch{
      console.log(error)
    }
  };

  return (
    <>
      <div id="createroom">
        <div className="createroombox">
          <form>
            <div className="mb-3">
              <label htmlFor="roomName" className="form-label">Room Name</label>
              <input
                type="text"
                className="form-control"
                id="roomName"
                value={roomName}
                onChange={handleRoomNameChange}
                placeholder="Enter Room Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="roomId" className="form-label">Room ID</label>
              <input
                type="text"
                className="form-control"
                id="roomId"
                value={roomId}
                onChange={handleRoomIdChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="termsCheck"
                checked={termsAccepted}
                onChange={handleTermsChange}
              />
              <label className="form-check-label" htmlFor="termsCheck">
                I accept the Terms & Conditions*
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-warning w-50 mx-1"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
            <button
              type="submit"
              className="btn btn-success w-25 mx-1"
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Createroom;
