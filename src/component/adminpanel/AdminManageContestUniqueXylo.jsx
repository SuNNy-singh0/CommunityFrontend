import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./AdminManageContestUniqueXylo.css";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";

// Helper function to format duration from minutes to a readable string
const formatDuration = (minutes) => {
  if (minutes == null || isNaN(minutes)) return 'N/A';
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`.trim();
};

// Helper function to determine contest status
const getContestStatus = (dateStr) => {
  if (!dateStr) return { text: "Unknown", class: "xylo-admin-manage-contest-status-unknown" };
  const contestDate = new Date(dateStr);
  if (isNaN(contestDate)) return { text: "Unknown", class: "xylo-admin-manage-contest-status-unknown" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  contestDate.setHours(0, 0, 0, 0);

  if (contestDate < today) return { text: "Completed", class: "xylo-admin-manage-contest-status-completed" };
  if (contestDate > today) return { text: "Upcoming", class: "xylo-admin-manage-contest-status-upcoming" };
  return { text: "Ongoing", class: "xylo-admin-manage-contest-status-ongoing" };
};

const getTagClass = (tag) => {
    if (!tag) return 'xylo-admin-manage-contest-tag-blue';
    const lowerTag = tag.toLowerCase();
    if (['easy', 'dsa'].includes(lowerTag)) return 'xylo-admin-manage-contest-tag-blue';
    if (['medium'].includes(lowerTag)) return 'xylo-admin-manage-contest-tag-orange';
    if (['hard'].includes(lowerTag)) return 'xylo-admin-manage-contest-tag-red';
    if (['java', 'mern'].includes(lowerTag)) return 'xylo-admin-manage-contest-tag-pink';
    if (['general'].includes(lowerTag)) return 'xylo-admin-manage-contest-tag-green';
    return 'xylo-admin-manage-contest-tag-blue'; // Default
};

const AdminManageContestUniqueXylo = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Handler to delete a contest
  const deleteContest = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this contest?')) return;
    setDeletingId(id);
    setDeleteError(null);
    try {
      await axios.delete(`https://buyproduct4u.org/contests/delete/${id}`);
      setContests((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setDeleteError('Failed to delete contest. Please try again.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://buyproduct4u.org/contests/all');
        const validContests = response.data.filter(c => c.heading && c.date);
        setContests(validContests);
        setError(null);
      } catch (err) {
        setError('Failed to fetch contests. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="xylo-admin-manage-contest-root">
      {/* Sidebar */}
      <aside className="xylo-admin-manage-contest-sidebar">
        <nav className="xylo-admin-manage-contest-nav">
          <a onClick={() => navigate('/admin')} className="xylo-admin-manage-contest-nav-link">Dashboard</a>
          <a onClick={() => navigate('/admin/allusers')} className="xylo-admin-manage-contest-nav-link">All Users</a>
          <a onClick={() => navigate('/admin/managejobs')} className="xylo-admin-manage-contest-nav-link">Manage Jobs</a>
          <a onClick={() => navigate('/admin/managecontests')} className="xylo-admin-manage-contest-nav-link xylo-admin-manage-contest-nav-active">Manage Contests</a>
          <a onClick={() => navigate('/admin/dailymcqs')} className="xylo-admin-manage-contest-nav-link" >Daily MCQs</a>
        </nav>
        <div className="xylo-admin-manage-contest-logout" onClick={() => navigate('/login')}>
          <FaSignOutAlt /> Logout
        </div>
      </aside>
      {/* Main Content */}
      <main className="xylo-admin-manage-contest-main">
        {/* Header */}
        <header className="xylo-admin-manage-contest-header">
          <div className="xylo-admin-manage-contest-header-title">Manage Contests</div>
          <div className="xylo-admin-manage-contest-header-profile">
            <div className="xylo-admin-manage-contest-header-user">
              <span>Alexander Mitchell</span>
              <span className="xylo-admin-manage-contest-header-role">Admin</span>
            </div>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" className="xylo-admin-manage-contest-header-avatar" />
          </div>
          <button className="xylo-admin-manage-contest-create-btn" onClick={()=>{
            navigate('/contestform')
          }}>+ Create New Contest</button>
        </header>
        {/* Filters/Search */}
        <div className="xylo-admin-manage-contest-controls">
          <input className="xylo-admin-manage-contest-search" placeholder="Search contests..." />
          <select className="xylo-admin-manage-contest-dropdown"><option>All Communities</option></select>
          <select className="xylo-admin-manage-contest-dropdown"><option>All Difficulties</option></select>
          <select className="xylo-admin-manage-contest-dropdown"><option>Status</option></select>
        </div>
        {/* Contest Cards Grid */}
        {loading ? (
          <div>Loading contests...</div>
        ) : error ? (
          <div className="xylo-admin-manage-contest-error">{error}</div>
        ) : (
          <>
            {deleteError && <div className="xylo-admin-manage-contest-error">{deleteError}</div>}
            <div className="xylo-admin-manage-contest-grid">
            {contests.map((c) => {
              const status = getContestStatus(c.date);
              const actions = status.text === 'Completed' ? ['View Results', 'Duplicate'] : ['Edit', 'View Registrations'];
              const tags = [c.communitytype ?? 'N/A', c.difficultyLevel ?? 'N/A'].filter(Boolean);

              return (
                <div className="xylo-admin-manage-contest-card" key={c.id ?? Math.random()}>
                  <div className="xylo-admin-manage-contest-card-delete">
                    <button
                      className="xylo-admin-manage-contest-delete-btn"
                      title="Delete Contest"
                      onClick={() => deleteContest(c.id)}
                      disabled={deletingId === c.id}
                    >
                      <FaTrash color="#d9534f" size={18} />
                    </button>
                  </div>
                  <div className="xylo-admin-manage-contest-card-header">
                    <span className={status.class}>{status.text}</span>
                  </div>
                  <div className="xylo-admin-manage-contest-card-title">{c.heading ?? 'Untitled Contest'}</div>
                  <div className="xylo-admin-manage-contest-card-subtitle">{c.description ?? 'No description provided.'}</div>
                  <div className="xylo-admin-manage-contest-card-info">
                    <div><span role="img" aria-label="calendar">📅</span> {c.date ? new Date(c.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                    <div><span role="img" aria-label="clock">⏰</span> {c.time ?? 'N/A'}</div>
                    <div><span role="img" aria-label="hourglass">⏳</span> Duration: {formatDuration(c.duration)}</div>
                    <div><span role="img" aria-label="users">👥</span> {c.registrations ?? 0} registrations</div>
                  </div>
                  <div className="xylo-admin-manage-contest-card-tags">
                    {tags.map((tag, i) => (
                      <span key={i} className={getTagClass(tag)}>{tag ?? 'N/A'}</span>
                    ))}
                  </div>
                  <div className="xylo-admin-manage-contest-card-actions">
                    {actions.map((action, i) => (
                      <button key={i} className="xylo-admin-manage-contest-card-btn">{action}</button>
                    ))}
                  </div>
                </div>
              );
            })}
            </div>
          </>
        )}
        {/* Pagination */}
        <div className="xylo-admin-manage-contest-pagination">
          <button className="xylo-admin-manage-contest-pagination-btn" disabled>Previous</button>
          <button className="xylo-admin-manage-contest-pagination-btn xylo-admin-manage-contest-pagination-active">1</button>
          <button className="xylo-admin-manage-contest-pagination-btn">2</button>
          <button className="xylo-admin-manage-contest-pagination-btn">Next</button>
        </div>
      </main>
    </div>
  );
};

export default AdminManageContestUniqueXylo;
