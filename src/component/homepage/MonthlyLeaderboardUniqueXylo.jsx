import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCrown, FaSyncAlt } from "react-icons/fa";
import "./MonthlyLeaderboardUniqueXylo.css";
import { getUser } from "../../utils/auth";

const MonthlyLeaderboardUniqueXylo = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const fetchData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [topUsersResponse, userStatsResponse] = await Promise.all([
        axios.get('https://asliengineers.com/usercontrol/top-users'),
        axios.get(`https://asliengineers.com/usercontrol/user-rank/${currentUser.username}`)
      ]);
      console.log(userStatsResponse)
      setTopPerformers(topUsersResponse.data.slice(0, 3).map((user, index) => ({
        ...user,
        rank: index + 1,
        points: user.coins,
        borderColor: index === 0 ? "#ffd700" : (index === 1 ? "#c0c0c0" : "#cd7f32"),
        crown: index === 0,
        tag: "Dev", // Default tag
        tagColor: "#a259f7", // Default color
        avatar: user.profilePicUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256&facepad=2"
      })));

      setUserStats({
        ...userStatsResponse.data,
        name: currentUser.username,
        avatar: userStatsResponse.profilePicUrl || "/hackthon.jpg"
      });

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  if (loading) {
    return <div className="xylo-leaderboard-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="xylo-leaderboard-container">
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          {error}
          <button 
            onClick={fetchData}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            <FaSyncAlt /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="xylo-leaderboard-container">
      <h2 className="xylo-leaderboard-title">
        <span role="img" aria-label="trophy">🏆</span> Monthly Leaderboard
      </h2>
      <div className="xylo-leaderboard-subtitle">Top contributors this month</div>
      <div className="xylo-leaderboard-top3-row">
        {topPerformers.map((user, idx) => (
          <div
            key={user.rank}
            className={`xylo-leaderboard-card xylo-leaderboard-rank${user.rank}`}
            style={{ borderColor: user.borderColor }}
          >
            <div className={`xylo-leaderboard-rank-badge xylo-leaderboard-rank-badge${user.rank}`}>{`#${user.rank}`}</div>
            <div className="xylo-leaderboard-avatar-wrapper">
              <img
                src={user.avatar}
                alt={user.name}
                className="xylo-leaderboard-avatar"
              />
              {user.crown && (
                <FaCrown className="xylo-leaderboard-crown" color="#ffd700" size={28} />
              )}
            </div>
            <div className="xylo-leaderboard-name">{user.name}</div>
            <div className="xylo-leaderboard-tag" style={{ background: user.tagColor }}>{user.tag}</div>
            <div className="xylo-leaderboard-points">
              <span role="img" aria-label="trophy">🏆</span> {user.points} points
            </div>
          </div>
        ))}
      </div>
      {userStats && (
        <div className="xylo-leaderboard-current-user-wrapper">
          {/* <img src={userStats.avatar} alt={userStats.name} className="xylo-leaderboard-current-avatar" /> */}
          <div className="xylo-leaderboard-current-details">
            <div className="xylo-leaderboard-current-label">Your Current Ranking</div>
            <div className="xylo-leaderboard-current-name">{userStats.name}</div>
          </div>
          <div className="xylo-leaderboard-current-rank">
            <span className="xylo-leaderboard-current-ranknum">Rank</span>
            <span className="xylo-leaderboard-current-rankval">#{userStats.rank}</span>
          </div>
          <div className="xylo-leaderboard-current-points">
            <span className="xylo-leaderboard-current-pointsnum">{userStats.coins}</span>
            <span className="xylo-leaderboard-current-pointstxt">Points</span>
          </div>
        </div>
      )}
      <button className="xylo-leaderboard-full-btn">View Full Leaderboard</button>
    </div>
  );
};

export default MonthlyLeaderboardUniqueXylo;
