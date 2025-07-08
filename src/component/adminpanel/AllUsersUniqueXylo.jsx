import React, { useState, useEffect } from 'react';
import './AllUsersUniqueXylo.css';
import { FaSearch, FaChevronDown, FaUpload, FaPlus, FaBell, FaGem } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const communityColors = {
    MERN: '#7e8fff',
    DSA: '#60d6b0',
    Java: '#ff8b8b',
};

const AllUsersUniqueXylo = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsersResponse = await axios.get('http://13.201.100.143:8080/rooms/alluser');
        const usersData = allUsersResponse.data;

        const detailedUsers = await Promise.all(
          usersData.map(async (user) => {
            try {
              const userDetailsResponse = await axios.get(`http://13.201.100.143:8080/usercontrol/${user.username}`);
              return { ...user, ...userDetailsResponse.data };
            } catch (error) {
              console.error(`Failed to fetch details for user ${user.username}`, error);
              return user; // Return basic user data if details fetch fails
            }
          })
        );

        setUsers(detailedUsers);
      } catch (error) {
        setError('Failed to fetch users.');
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  return (
    <div className="xylo-all-users-layout">
      <aside className="xylo-all-users-sidenav">

        <nav className="xylo-all-users-sidenav-nav">
          <a className="xylo-all-users-sidenav-link" onClick={() => navigate('/admin')}>Dashboard</a>
          <a className="xylo-all-users-sidenav-link xylo-all-users-sidenav-link-active" >All Users</a>
          <a className="xylo-all-users-sidenav-link" onClick={() => navigate('/admin/managejobs')}>Manage Jobs</a>
          <a className="xylo-all-users-sidenav-link" onClick={() => navigate('/admin/managecontests')}>Manage Contests</a>
          <a className="xylo-all-users-sidenav-link" onClick={() => navigate('/admin/dailymcqs')}>Daily MCQs</a>
        </nav>
        <div className="xylo-all-users-sidenav-logout-row">
          <button className="xylo-all-users-sidenav-logout"onClick={() => navigate('/login')}>Logout</button>
        </div>
      </aside>

      <main className="xylo-all-users-main">
        <header className="xylo-all-users-header">
          <div>
            <h1 className="xylo-all-users-title">All Users</h1>
            <p className="xylo-all-users-subtitle">Manage community members</p>
          </div>
          <div className="xylo-all-users-admin-profile">
            <FaBell className="xylo-all-users-notification-icon" />
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Admin" className="xylo-all-users-admin-avatar" />
            <div>
              <div className="xylo-all-users-admin-name">Alexander Mitchell</div>
              <div className="xylo-all-users-admin-role">Admin</div>
            </div>
          </div>
        </header>

        <div className="xylo-all-users-controls">
          <div className="xylo-all-users-search-bar">
            <FaSearch className="xylo-all-users-search-icon" />
            <input type="text" placeholder="Search users..." />
          </div>
          <div className="xylo-all-users-filters">
            <button className="xylo-all-users-filter-btn">All Communities <FaChevronDown /></button>
            <button className="xylo-all-users-filter-btn">Sort By <FaChevronDown /></button>
            <button className="xylo-all-users-export-btn"><FaUpload /> Export</button>
          </div>
          <button className="xylo-all-users-add-btn" onClick={() => navigate('/login')}><FaPlus /> Add New User</button>
        </div>

        <div className="xylo-all-users-table-container">
          <table className="xylo-all-users-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>Date of creation</th>
                <th>COINS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="6">{error}</td></tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>
                      <div className="xylo-all-users-user-cell">
                        <img src={user.profilePicUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt={user.username} className="xylo-all-users-user-avatar" />
                        <div>
                          <div className="xylo-all-users-user-name">{user.name || user.username}</div>
                          <div className="xylo-all-users-user-handle">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.date}</td>
                    <td>{user.phonenumber || 'N/A'}</td>
                    <td>
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="xylo-all-users-community-pill" style={{ backgroundColor: communityColors[skill] || '#ccc' }}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="xylo-all-users-community-pill" style={{ backgroundColor: '#ccc' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      <div className="xylo-all-users-coins-cell">
                        <FaGem className="xylo-all-users-coin-icon" /> {user.coins ? user.coins.toLocaleString() : 'N/A'}
                      </div>
                    </td>
                    <td><a href="#" className="xylo-all-users-view-profile">View Profile</a></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="xylo-all-users-pagination">
          <span>Showing 1 to 5 of 42 entries</span>
          <div className="xylo-all-users-page-buttons">
            <button>Previous</button>
            <button className="xylo-all-users-page-active">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>

       
      </main>
    </div>
  );
};

export default AllUsersUniqueXylo;
