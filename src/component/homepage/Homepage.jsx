
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
import { Helmet } from 'react-helmet-async';
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
    <Helmet>
        {/* Page Title: Unique and descriptive, including keywords and brand name */}
        <title>Asli Engineers | India's Leading Engineering Community | Jobs, MCQs, Contests, Discussions</title>

        {/* Meta Description: Compelling summary for search results, keyword-rich */}
        <meta
          name="description"
          content="Join Asli Engineers, India's premier platform for real engineers. Explore trending community discussions, master daily MCQs, find dream tech jobs, participate in contests, and connect with top talent. Grow your career with authentic insights."
        />

        {/* Canonical URL: Prevents duplicate content issues */}
        <link rel="canonical" href="https://www.asliengineers.com/" />

        {/* Open Graph Tags (for social media sharing like Facebook, LinkedIn) */}
        <meta property="og:title" content="Asli Engineers | India's Leading Engineering Community" />
        <meta property="og:description" content="Join Asli Engineers, India's premier platform for real engineers. Explore trending community discussions, master daily MCQs, find dream tech jobs, participate in contests, and connect with top talent. Grow your career with authentic insights." />
        <meta property="og:image" content="https://aslicommunitystorage.s3.ap-south-1.amazonaws.com/logo.png" /> {/* Replace with your actual logo/image for social sharing */}
        <meta property="og:url" content="https://www.asliengineers.com/" />
        <meta property="og:type" content="website" /> {/* Use 'website' for homepages */}

        {/* Twitter Card Tags (for Twitter/X sharing) */}
        <meta name="twitter:card" content="summary_large_image" /> {/* Use 'summary_large_image' for a larger image preview */}
        <meta name="twitter:site" content="@AsliEngineers" /> {/* Replace with your actual Twitter handle if you have one */}
        <meta name="twitter:title" content="Asli Engineers | India's Leading Engineering Community" />
        <meta name="twitter:description" content="Join Asli Engineers, India's premier platform for real engineers. Explore trending community discussions, master daily MCQs, find dream tech jobs, participate in contests, and connect with top talent. Grow your career with authentic insights." />
        <meta name="twitter:image" content="https://www.asliengineers.com/logo-social-share.jpg" /> {/* Same image as og:image */}
      </Helmet>
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