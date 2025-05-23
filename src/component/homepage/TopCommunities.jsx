import React from "react";
import { FaStar, FaComments } from "react-icons/fa";
import "./TopCommunities.css";
import { useNavigate } from 'react-router-dom';

const communityData = [
  {
    id: "community_mongo",
    name: "DSA",
    description: "Best SQL and no Sql discussion and statement",
    discussions: 57,
    imgSrc: "/database.png", // Replace with actual MongoDB image path
  },
  {
    id: "community_react",
    name: "MERN",
    description: "Best React frontend discussion",
    discussions: 57,
    imgSrc: "/structure.png", // Replace with actual React image path
  },
  {
    id: "community_python",
    name: "Java",
    description: "Best Java, J2EE discussion",
    discussions: 57,
    imgSrc: "/java.png", // Replace with actual Python image path
  },
];

const TopCommunities = ({ username }) => {
  const navigate = useNavigate();
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
            <div className="unique_community_actions">
          
              <button 
                className="unique_community_join_btn"
                onClick={() => navigate(`/communitychat/${community.name}/${username}`)}
              >
                Join Community
              </button>
              
            </div>
            <div className="unique_discussion_count">
                <FaComments className="unique_comments_icon" />
                <span>{community.discussions} Discussions</span>
              </div>
          </div>
        ))}

        
      </div>
    </div>
  );
};

export default TopCommunities;
