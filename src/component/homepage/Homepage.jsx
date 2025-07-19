
import DeveloperCommunity from './DeveloperCommunity'
import React, { useState, useEffect } from 'react'
import DailyMCQ from './DailyMCQ'
import TopCommunities from './TopCommunities'
import UpComingCommunity from './UpComingCommunity'
import Contest from './Contest'
import DreamTechJob from './DreamTechJob'
import MonthlyLeaderboardUniqueXylo from './MonthlyLeaderboardUniqueXylo'
import JobAlertBannerUniqueXylo from './JobAlertBannerUniqueXylo'
import UpcomingEventsUniqueXylo from './UpcomingEventsUniqueXylo'
import { getUser } from '../../utils/auth'
import Footer from './Footer'

function Homepage() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  return (
    <>
   
    <DeveloperCommunity/>
    
    
    <DailyMCQ username={username}/>
    <div id="tech-communities">  <TopCommunities username={username}/></div>
   
    <div id="contests-mcqs">
    <UpcomingEventsUniqueXylo/>
    </div>
    
    <UpComingCommunity/>
    <MonthlyLeaderboardUniqueXylo/>
    
    <DreamTechJob/>
    <JobAlertBannerUniqueXylo/>
  
    </>
  )
}

export default Homepage