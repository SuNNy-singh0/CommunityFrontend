import React from 'react'
import Upperbanner from './Upperbanner'
import Feature from './Feature'
import Stay from './Stay'
import Community from './Community'
import FAQ from './FAQ'
import Footer from './Footer'
import JobBanner from '../JobProfile/JobBanner'

import MCQPage from '../MCQ/MCQpage'

function Mainpage() {
  return (
    <>
     <Upperbanner/>
     <MCQPage/>
     <Stay/>
     <Community/>
     <JobBanner/>
     <Feature/>
     
    
     <FAQ/>
     <Footer/>
    </>
   
  
  )
}

export default Mainpage
