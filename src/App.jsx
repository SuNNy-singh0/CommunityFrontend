import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import JoinRoom from './component/JoinRoom';
import Createroom from './component/Createroom';
import Login from './component/Login';

import Connect from './component/Connect';
import Mainpage from './component/Mainpage/Mainpage';
import UserProfile from './component/UserProfile/UserProfile';
import JobForm from './component/JobProfile/JobForm';
import JobBoard from './component/JobProfile/JobBoard';
import MCQform from './component/MCQ/MCQform';
import CommunityChat from './component/community/CommunityChat';
import Homepage from './component/homepage/Homepage';
import CommunityChatUniqueXylo from './component/homepage/CommunityChatUniqueXylo';
import JobBoardUniqueZephyr from './component/homepage/JobBoardUniqueZephyr';
import DreamTechRoleUniqueXylo from './component/homepage/DreamTechRoleUniqueXylo';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route to join the room */}
          <Route path='/createroom' element={<Createroom />} />
          <Route path='/login' element={<Login />} />
        
          <Route path='/Connect/:username/:userid' element={<Connect/>} />
          {/* Route to chat page */}
          
          <Route path='/' element={<Mainpage />} />
          <Route path='/profile' element={<UserProfile/>} />
          <Route path='/jobform' element={<JobForm/>} />
          <Route path='/MCQForm' element={<MCQform/>} />
          <Route path='/jobboard' element={<JobBoard/>} />
          <Route path='/job' element={<JobBoardUniqueZephyr/>} />
          <Route path='/newpage' element={<Homepage/>} />
          <Route path='/techjob' element={<DreamTechRoleUniqueXylo/>} />
          <Route path='/communitychat/:communityname/:username' element={<CommunityChatUniqueXylo/>} />
          <Route path='/Community/:username/:userid' element={<CommunityChat/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
