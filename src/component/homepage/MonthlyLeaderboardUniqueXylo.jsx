import React from "react";
import { FaCrown } from "react-icons/fa";
import "./MonthlyLeaderboardUniqueXylo.css";

const leaderboardData = [
  {
    rank: 1,
    name: "Alex Morgan",
    tag: "MERN",
    points: 2845,
    tagColor: "#a259f7",
    borderColor: "#ffd700",
    crown: true,
  },
  {
    rank: 2,
    name: "Sarah Chen",
    tag: "DSA",
    points: 2456,
    tagColor: "#3b82f6",
    borderColor: "#c0c0c0",
    crown: false,
  },
  {
    rank: 3,
    name: "Michael Johnson",
    tag: "Java",
    points: 2189,
    tagColor: "#22c55e",
    borderColor: "#cd7f32",
    crown: false,
  },
];

const currentUser = {
  name: "David Wilson",
  rank: 8,
  points: 1845,
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const MonthlyLeaderboardUniqueXylo = () => {
  return (
    <div className="xylo-leaderboard-container">
      <h2 className="xylo-leaderboard-title">
        <span role="img" aria-label="trophy">🏆</span> Monthly Leaderboard
      </h2>
      <div className="xylo-leaderboard-subtitle">Top contributors this month</div>
      <div className="xylo-leaderboard-top3-row">
        {leaderboardData.map((user, idx) => (
          <div
            key={user.rank}
            className={`xylo-leaderboard-card xylo-leaderboard-rank${user.rank}`}
            style={{ borderColor: user.borderColor }}
          >
            <div className={`xylo-leaderboard-rank-badge xylo-leaderboard-rank-badge${user.rank}`}>{`#${user.rank}`}</div>
            <div className="xylo-leaderboard-avatar-wrapper">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256&facepad=2"
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
      <div className="xylo-leaderboard-current-user-wrapper">
        <img src={currentUser.avatar} alt={currentUser.name} className="xylo-leaderboard-current-avatar" />
        <div className="xylo-leaderboard-current-details">
          <div className="xylo-leaderboard-current-label">Your Current Ranking</div>
          <div className="xylo-leaderboard-current-name">{currentUser.name}</div>
        </div>
        <div className="xylo-leaderboard-current-rank">
          <span className="xylo-leaderboard-current-ranknum">Rank</span>
          <span className="xylo-leaderboard-current-rankval">#{currentUser.rank}</span>
        </div>
        <div className="xylo-leaderboard-current-points">
          <span className="xylo-leaderboard-current-pointsnum">{currentUser.points}</span>
          <span className="xylo-leaderboard-current-pointstxt">Points</span>
        </div>
      </div>
      <button className="xylo-leaderboard-full-btn">View Full Leaderboard</button>
    </div>
  );
};

export default MonthlyLeaderboardUniqueXylo;
