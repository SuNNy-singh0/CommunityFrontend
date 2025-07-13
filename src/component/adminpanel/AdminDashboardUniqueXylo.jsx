import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboardUniqueXylo.css";
import { FaUserAlt, FaClipboardList, FaTrophy, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";





const stats = [
  {
    label: "Total Users",
    value: "8,429",
    icon: <FaUserAlt />,
    trend: "+12.5% vs last month",
    trendClass: "xylo-admin-stat-green",
  },
  {
    label: "Total Jobs Posted",
    value: "1,247",
    icon: <FaClipboardList />,
    trend: "+8.3% vs last month",
    trendClass: "xylo-admin-stat-green",
  },
  {
    label: "Upcoming Contests",
    value: "18",
    icon: <FaTrophy />,
    trend: "+24.1% vs last month",
    trendClass: "xylo-admin-stat-green",
  },
  {
    label: "MCQs Uploaded Today",
    value: "42",
    icon: <FaQuestionCircle />,
    trend: "",
    trendClass: "xylo-admin-stat-green",
  },
];

const communityColors = {
  MERN: "#7e8fff",
  DSA: "#60d6b0",
  Java: "#ff8b8b",
};

const statusColors = {
  Online: "#60d6b0",
  Away: "#ffd966",
  Offline: "#c2c2c2",
};

const AdminDashboardUniqueXylo = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get("https://asliengineers.com/event/all");
        const filteredData = response.data.filter(item => item.name && item.emailid && item.phonenumber && item.eventname);
        setRegistrations(filteredData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://asliengineers.com/rooms/alluser");
        setUsers(response.data.slice(-5).reverse());
        setLoadingUsers(false);
      } catch (error) {
        setErrorUsers(error);
        setLoadingUsers(false);
      }
    };

    fetchRegistrations();
    fetchUsers();
  }, []);
  return (
    <div className="xylo-admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="xylo-admin-sidenav">
        
        <nav className="xylo-admin-sidenav-nav">
          <a className="xylo-admin-sidenav-link xylo-admin-sidenav-link-active" href="#">Dashboard</a>
          <a className="xylo-admin-sidenav-link" onClick={() => navigate('/admin/allusers')}>All Users</a>
          <a className="xylo-admin-sidenav-link" onClick={() => navigate('/admin/managejobs')}>Manage Jobs</a>
          <a className="xylo-admin-sidenav-link" onClick={() => navigate('/admin/managecontests')}>Manage Contests</a>
          <a className="xylo-admin-sidenav-link" onClick={() => navigate('/admin/dailymcqs')}>Daily MCQs</a>
        </nav>
        <div className="xylo-admin-sidenav-logout-row">
          <button className="xylo-admin-sidenav-logout" onClick={() => navigate('/login')}>Logout</button>
        </div>
      </aside>
      {/* Main Content */}
      <div className="xylo-admin-dashboard-main">
        <div className="xylo-admin-dashboard-header-row">
          <div className="xylo-admin-dashboard-header">Dashboard</div>
          <div className="xylo-admin-dashboard-admin-profile">
            <img className="xylo-admin-dashboard-admin-avatar" src="https://randomuser.me/api/portraits/men/11.jpg" alt="Admin" />
            <div>
              <div className="xylo-admin-dashboard-admin-name">Alexander Mitchell</div>
              <div className="xylo-admin-dashboard-admin-role">Admin</div>
            </div>
          </div>
        </div>
        <div className="xylo-admin-dashboard-stats-row">
          {stats.map((stat, idx) => (
            <div className="xylo-admin-dashboard-stat-card" key={idx}>
              <div className="xylo-admin-dashboard-stat-icon">{stat.icon}</div>
              <div className="xylo-admin-dashboard-stat-label">{stat.label}</div>
              <div className="xylo-admin-dashboard-stat-value">{stat.value}</div>
              <div className={`xylo-admin-dashboard-stat-trend ${stat.trendClass}`}>{stat.trend}</div>
            </div>
          ))}
        </div>
        <div className="xylo-admin-dashboard-content-row">
          <div className="xylo-admin-dashboard-user-analytics xylo-admin-dashboard-card">
            <div className="xylo-admin-dashboard-card-title">User Analytics</div>
                        <div className="xylo-admin-dashboard-user-table">
              <div className="xylo-admin-dashboard-user-table-header">
                <div>User</div>
                <div>Phone Number</div>
                <div>Community</div>
                <div>Activity</div>
                <div>Status</div>
              </div>
              {loadingUsers && <p>Loading users...</p>}
              {errorUsers && <p>Error fetching users: {errorUsers.message}</p>}
              {!loadingUsers && !errorUsers && users.map((user, idx) => (
                <div className="xylo-admin-dashboard-user-table-row" key={idx}>
                  <div className="xylo-admin-dashboard-user-info">
                   
                    <div>
                      <div className="xylo-admin-dashboard-user-name">{user.username}</div>
                      <div className="xylo-admin-dashboard-user-email">{user.email}</div>
                    </div>
                  </div>
                  <div>{user.phonenumber || 'N/A'}</div>
                  <div>
                    <span className="xylo-admin-dashboard-community-pill" style={{ background: communityColors.MERN }}>General</span>
                  </div>
                  <div>N/A</div>
                  <div>
                    <span className="xylo-admin-dashboard-status-pill" style={{ background: statusColors.Online }}>Online</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="xylo-admin-dashboard-registrations xylo-admin-dashboard-card">
            <div className="xylo-admin-dashboard-card-title-row">
              <div className="xylo-admin-dashboard-card-title">Contest Registrations</div>
              <button className="xylo-admin-dashboard-viewall-btn">View All</button>
            </div>
                        <div className="xylo-admin-dashboard-registrations-list">
              {loading && <p>Loading registrations...</p>}
              {error && <p>Error fetching registrations: {error.message}</p>}
              {!loading && !error && registrations.map((reg, idx) => (
                <div className="xylo-admin-dashboard-registration-row" key={idx}>
                  <div className="xylo-admin-dashboard-user-info">
                    
                    <div>
                      <div className="xylo-admin-dashboard-user-name">{reg.name}</div>
                      <div className="xylo-admin-dashboard-user-email">{reg.eventname}</div>
                    </div>
                  </div>
                  <div className="xylo-admin-dashboard-registration-meta">
                    <span className="xylo-admin-dashboard-registration-time">{reg.emailid}</span>
                    <span className="xylo-admin-dashboard-community-pill" style={{ background: communityColors.DSA }}>{reg.phonenumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboardUniqueXylo;
