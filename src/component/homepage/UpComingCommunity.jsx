import React from 'react'
import { FaStar, FaComments } from "react-icons/fa";
import "./TopCommunities.css"; // Import CSS file
function UpComingCommunity() {
  const communityData = [
    {
      id: "community_python",
      name: "Python",
      description: "Explore all things Python including scripting, data analysis, AI/ML discussions, and more.",
      discussions: "Active community sharing tips, tutorials, and research on Python and machine learning.",
      imgSrc: "/python.png", // Replace with actual Python image path
    },
    {
      id: "community_Devops",
      name: "DevOps",
      description: "Infrastructure, CI/CD pipelines, Docker, Kubernetes, and all things DevOps.",
      discussions: "Vibrant discussions around automation, deployment strategies, and real-world DevOps problems.",
      imgSrc: "/devops.png", // Replace with actual DevOps image path
    },
    {
      id: "community_ReactNative",
      name: "React Native",
      description: "Mobile development using React Native, performance tips, and cross-platform best practices.",
      discussions: "Community driven by real-world projects, optimization tricks, and library updates.",
      imgSrc: "/native.png", // Replace with actual React Native image path
    },
  ];
  return (
     <div className="unique_top_communities_container">
          <h2 className="unique_top_communities_title">Upcoming Communities</h2>
    
          <div className="unique_top_communities_slider">
            
    
            {communityData.map((community) => (
              <div key={community.id} className="unique_community_card">
                {/* Badge */}
                <div style={{
                  background:'url("/upcoming.jpg")',
                  backgroundSize:'cover'
                }}>
                <div className="unique_community_badge">
                  <FaStar className="unique_community_star_icon" />
                  <span>12,500+ Developers</span>
                </div>
    
                {/* Image */}
                <div className="unique_community_image_container">
                  <img src={community.imgSrc} alt={community.name} className="unique_community_image" />
                </div>
               </div>
                {/* Content */}
                <h3 className="unique_community_name">{community.name}</h3>
                <p className="unique_community_description">{community.description}</p>
    
                {/* Discussion Count */}
                           {/* <div className="unique_community_discussions">
                             <FaComments className="unique_community_comment_icon" />
                             <span>{community.discussions} New Discussions Today</span>
                           </div> */}
    
                {/* Button */}
                <button className="unique_community_join_btn">Notify Me</button>
              </div>
            ))}
    
            
          </div>
        </div>
  )
}

export default UpComingCommunity