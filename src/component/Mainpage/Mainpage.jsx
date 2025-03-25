import React from 'react'
import Upperbanner from './Upperbanner'
import Feature from './Feature'
import Stay from './Stay'
import Community from './Community'
import FAQ from './FAQ'
import Footer from './Footer'
import JobBanner from '../JobProfile/JobBanner'

import MCQPage from '../MCQ/MCQpage'
import Leaderboard from '../leaderboard/Leaderboard'

function Mainpage() {
  return (
    <>
     <Upperbanner/>
     <MCQPage/>
     <Stay/>
     <Community/>
     <Leaderboard/>
     <JobBanner/>
     <div id='mobile'>
     <Feature/>
     </div>
    
     <FAQ/>
     <Footer/>
    </>
   
  
  )
}

export default Mainpage
