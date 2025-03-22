import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from './component/ChatPage';
import JoinRoom from './component/JoinRoom';
import Createroom from './component/Createroom';
import Login from './component/Login';
import CommunityMain from './component/CommunityMain';
import Connect from './component/Connect';
import Mainpage from './component/Mainpage/Mainpage';
import UserProfile from './component/UserProfile/UserProfile';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route to join the room */}
          <Route path='/createroom' element={<Createroom />} />
          <Route path='/login' element={<Login />} />
          <Route path='/main' element={<CommunityMain/>} />
          <Route path='/Connect/:username/:userid' element={<Connect/>} />
          {/* Route to chat page */}
          <Route path='/chat/:username/:userid' element={<ChatPage />} />
          <Route path='/' element={<Mainpage />} />
          <Route path='/profile' element={<UserProfile/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
