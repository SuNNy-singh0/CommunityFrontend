import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCrown,
  FaCoins,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from "react-icons/fa";
import "./Leaderboard.css"; // Comment out to disable CSS

const Leaderboard = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [userStats, setUserStats] = useState({
    rank: 0,
    totalParticipants: 0,
    monthlyCoins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch top users
  const fetchTopUsers = async () => {
    try {
      const response = await axios.get('/api/usercontrol/top-users');
      console.log('Received top users:', response.data);
      setTopPerformers(response.data.map((user, index) => ({
        name: user.name,
        rank: index + 1,
        coins: user.coins,
        image: user.profilePicUrl || "/Usericon.png"
      })));
    } catch (error) {
      console.error('Error fetching top users:', error);
      setError('Failed to load top performers');
    }
  };

  // Function to fetch user rank and stats
  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`https://buyproduct4u.org/usercontrol/user-rank/TestUser2`);
      console.log('Received user stats:', response.data);
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Failed to load user statistics');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchTopUsers(), fetchUserStats()]);
      } catch (error) {
        console.error('Error in data fetching:', error);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="leaderboard-container">Loading leaderboard data...</div>;
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          {error}
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              Promise.all([fetchTopUsers(), fetchUserStats()]).finally(() => setLoading(false));
            }}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            <FaSyncAlt /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      {/* Header Section */}
      <div className="leaderboard-header">
        <div className="leaderboard-title">
          <span className="leaderboard-heading">Community Leaderboard</span>
          <span className="leaderboard-subtitle">February 2024</span>
        </div>
       
      </div>

      {/* Top 5 Performers */}
      <div className="leaderboard-top5">
        {/* <div className="leaderboard-top5-title">Top 5 Monthly Performers</div> */}
        {topPerformers.map((user, index) => (
          <div
            key={index}
            className={`leaderboard-card ${
              user.rank === 1 ? "leaderboard-card-highlight" : ""
            }`}
          >
            {user.rank === 1 && <FaCrown className="leaderboard-crown" />}
            <img src={user.image} alt={user.name} className="leaderboard-image" />
            <span className="leaderboard-username">{user.name}</span>
            <span className="leaderboard-rank">Rank #{user.rank}</span>
            <span className="leaderboard-coins">
              <FaCoins className="leaderboard-coin-icon" /> {user.coins} coins
            </span>
          </div>
        ))}
      </div>

      {/* User Stats */}
      <div className="leaderboard-stats">
        <div className="leaderboard-stat-box">
          <span className="leaderboard-stat-label">Your Rank</span>
          <span className="leaderboard-stat-value">#{userStats.rank}</span>
        </div>
        <div className="leaderboard-stat-box">
          <span className="leaderboard-stat-label">Monthly Coins</span>
          <span className="leaderboard-stat-value">{userStats.coins}</span>
        </div>
        <div className="leaderboard-stat-box">
          <span className="leaderboard-stat-label">Total Participants</span>
          <span className="leaderboard-stat-value">{userStats.totalParticipants.toLocaleString()}</span>
        </div>
      </div>

     
    </div>
  );
};

export default Leaderboard;
