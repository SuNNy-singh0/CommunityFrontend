import React from 'react'
import DeveloperCommunity from './DeveloperCommunity'
import DailyMCQ from './DailyMCQ'
import TopCommunities from './TopCommunities'
import UpComingCommunity from './UpComingCommunity'

function Homepage() {
  return (
    <>
    <DeveloperCommunity/>
    <DailyMCQ/>
    <TopCommunities/>
    <UpComingCommunity/>
    </>
  )
}

export default Homepage