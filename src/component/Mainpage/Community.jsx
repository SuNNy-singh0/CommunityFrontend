import React, { useEffect, useState } from 'react'
import './Mainpage.css'
import { FaUsers, FaComments, FaJs, FaJava, FaCodeBranch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser, getToken } from '../../utils/auth';

function Community() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [userCommunities, setUserCommunities] = useState([]);

    useEffect(() => {
        const user = getUser();
        if (user && user.username) {
            setUsername(user.username);
            checkUserCommunities(user.username);
        }
    }, []);

    const checkUserCommunities = async (username) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/community/user/${username}/communities`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserCommunities(data || []);
            }
        } catch (error) {
            console.error('Error checking user communities:', error);
        }
    };

    const joincommunity = async (communityname) => {
        if (!isAuthenticated()) {
            alert('Please login first to join the community');
            navigate('/login');
            return;
        }

        try {
            const token = getToken();
            const response = await fetch('http://localhost:8080/community/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    communitytype: communityname
                })
            });

            if (response.ok) {
                setUserCommunities([...userCommunities, communityname]);
                navigate(`/Connect/${communityname}/${username}`);
            } else {
                const errorText = await response.text();
                if (errorText.includes("User is already a member of this community")) {
                    navigate(`/Connect/${communityname}/${username}`);
                } else {
                    alert(errorText || 'Failed to join community');
                }
            }
        } catch (error) {
            console.error('Error joining community:', error);
            alert('Something went wrong while joining the community');
        }
    }

    const communities = [
        {
            id: 1,
            name: "MERN",
            displayName: "MERN Community",
            description: "Learn Full-Stack JavaScript Development with MongoDB, Express, React, and Node.js",
            members: "2.4k",
            active: "180",
            bgColor: "community-icon-blue",
            icon: <FaJs className="community-icon" />,
        },
        {
            id: 2,
            name: "Java",
            displayName: "Java Community",
            description: "Master Object-Oriented Programming and Enterprise Java Development",
            members: "3.1k",
            active: "210",
            bgColor: "community-icon-orange",
            icon: <FaJava className="community-icon" />,
        },
        {
            id: 3,
            name: "DSA",
            displayName: "DSA Community",
            description: "Excel in Data Structures & Algorithms with Expert Guidance",
            members: "1.8k",
            active: "150",
            bgColor: "community-icon-purple",
            icon: <FaCodeBranch className="community-icon" />,
        },
    ];

    return (
        <>
            <div className="tech-communities-container">
                <div className="tech-communities-header">
                    <h1 className="tech-title">Tech Communities</h1>
                    <p className="tech-subtitle">Join our specialized learning spaces</p>
                </div>

                <div className="tech-communities-grid">
                    {communities.map((community) => {
                        const isUserInCommunity = userCommunities.includes(community.name);
                        return (
                            <div key={community.id} className="community-card">
                                <div className={`community-icon-container ${community.bgColor}`}>{community.icon}</div>
                                <h3 className="community-name">{community.displayName}</h3>
                                <p className="community-description">{community.description}</p>
                                <div className="community-stats">
                                    <div className="community-stat">
                                        <FaUsers className="community-stat-icon" />
                                        <span>{community.members} Members</span>
                                    </div>
                                    <div className="community-stat">
                                        <FaComments className="community-stat-icon" />
                                        <span>{community.active} Active</span>
                                    </div>
                                </div>
                                <button 
                                    className={`join-button ${isUserInCommunity ? 'active' : ''}`}
                                    onClick={() => joincommunity(community.name)}
                                >
                                    {isUserInCommunity ? 'Enter Community' : 'Join Now'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default Community