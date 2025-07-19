import React from "react";
import { FaStar, FaComments } from "react-icons/fa";
import "./TopCommunities.css";
import { useNavigate } from 'react-router-dom';

const communityData = [
  {
    id: "community_mongo",
    name: "DSA",
    description: "Dive deep into Data Structures and Algorithms. Discuss problem-solving strategies, share coding challenges, and improve your algorithmic thinking with peers.",
    discussions: 57,
    imgSrc: "/Code.png", // Replace with actual MongoDB image path
  },
  {
    id: "community_react",
    name: "MERN",
    description: "Join the top community for React and MERN stack enthusiasts. Discuss frontend frameworks, share resources, and collaborate on modern web development.",
    discussions: 57,
    imgSrc: "/structure.png", // Replace with actual React image path
  },
  {
    id: "community_python",
    name: "Java",
    description: "Connect with fellow Java developers to discuss Java, J2EE, frameworks, and enterprise application development.",
    discussions: 57,
    imgSrc: "/java.png", // Replace with actual Python image path
  },
];

const TopCommunities = ({ username }) => {
  const navigate = useNavigate();

  const handleJoinCommunity = (communityName) => {
    if (username) {
      navigate(`/connect/${communityName}/${username}`);
    } else {
      alert('Please log in to join this community.');
      navigate(`/login`);
    }
  };
  return (
    <div className="unique_top_communities_container">
      <h2 className="unique_top_communities_title">Top Communities</h2>

      <div className="unique_top_communities_slider">
        

        {communityData.map((community) => (
          <div key={community.id} className="unique_community_card">
            {/* Badge */}
            <div style={{
              background:'url("/communitybac.jpg")',
              backgroundSize:'cover'
            }}>
            <div className="unique_community_badge">
              <FaStar className="unique_community_star_icon" />
              <span>Free Rewards</span>
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
            <div className="unique_community_actions">
          
              <button 
                className="unique_community_join_btn"
                onClick={() => handleJoinCommunity(community.name)}
              >
                Join Community
              </button>
              
            </div>
            {/* <div className="unique_discussion_count">
                <FaComments className="unique_comments_icon" />
                <span>{community.discussions} Discussions</span>
              </div> */}
          </div>
        ))}

        
      </div>
    </div>
  );
};

export default TopCommunities;
