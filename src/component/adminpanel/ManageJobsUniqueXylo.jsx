import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageJobsUniqueXylo.css";
import { FaSearch, FaEllipsisV, FaTrash } from "react-icons/fa";
import { HiOutlinePlus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";



const ManageJobsUniqueXylo = () => {
  const [search, setSearch] = useState("");
  const [community, setCommunity] = useState("All Communities");
  const [status, setStatus] = useState("Status");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://buyproduct4u.org/jobs/all');
        const formattedJobs = response.data.map(job => ({
          id: job.id,
          postimagelink: job.postimagelink,
          description: job.description,
          date: job.date,
          tags: job.tag.filter(t => t && t.trim() !== ''),
          communitytype: job.communitytype || 'General',
          sourcelink: job.sourcelink,
          icon: (job.communitytype || 'G').charAt(0).toUpperCase()
        }));
        setJobs(formattedJobs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const searchLower = search.toLowerCase();
    const descriptionMatch = job.description && job.description.toLowerCase().includes(searchLower);
    const communityTypeMatch = job.communitytype && job.communitytype.toLowerCase().includes(searchLower);
    const communityFilterMatch = community === "All Communities" || job.communitytype === community;

    return (descriptionMatch || communityTypeMatch) && communityFilterMatch;
  });

  const uniqueCommunities = [...new Set(jobs.map(job => job.communitytype))];

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent card's onClick from firing
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`https://buyproduct4u.org/jobs/delete/${id}`);
        setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      } catch (err) {
        console.error('Failed to delete job:', err);
        alert('Failed to delete the job. Please try again.');
      }
    }
  };

  return (
    <div className="xylo-manage-jobs-layout">
      <aside className="xylo-manage-jobs-sidenav">
        <nav className="xylo-manage-jobs-sidenav-nav">
          <a className="xylo-manage-jobs-sidenav-link" onClick={() => navigate('/admin')}>Dashboard</a>
          <a className="xylo-manage-jobs-sidenav-link" onClick={() => navigate('/admin/allusers')}>All Users</a>
          <a className="xylo-manage-jobs-sidenav-link xylo-manage-jobs-sidenav-link-active">Manage Jobs</a>
          <a className="xylo-manage-jobs-sidenav-link" onClick={() => navigate('/admin/managecontests')}>Manage Contests</a>
          <a className="xylo-manage-jobs-sidenav-link" onClick={() => navigate('/admin/dailymcqs')}>Daily MCQs</a>
        </nav>
        <div className="xylo-manage-jobs-sidenav-logout-row">
          <button className="xylo-manage-jobs-sidenav-logout" onClick={() => navigate('/login')}>Logout</button>
        </div>
      </aside>
      <main className="xylo-manage-jobs-main">
      <div className="xylo-manage-jobs-header">
        <h2>Manage Jobs</h2>
        <button className="xylo-manage-jobs-post-btn" onClick={() => navigate('/jobform')}>
          <HiOutlinePlus size={18} /> Post New Job
        </button>
      </div>
      <div className="xylo-manage-jobs-subheader">
        <span>Post and manage job opportunities</span>
      </div>
      <div className="xylo-manage-jobs-toolbar">
        <div className="xylo-manage-jobs-searchbar">
          <FaSearch className="xylo-manage-jobs-search-icon" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="xylo-manage-jobs-dropdown"
          value={community}
          onChange={e => setCommunity(e.target.value)}
        >
          <option value="All Communities">All Communities</option>
          {uniqueCommunities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
      </div>
      <div className="xylo-manage-jobs-grid">
        {loading ? (
          <p>Loading jobs...</p>
        ) : error ? (
          <p className="xylo-manage-jobs-error">{error}</p>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="xylo-manage-jobs-card">
              {job.postimagelink && (
                <img src={job.postimagelink} alt="Job post" className="xylo-manage-jobs-card-img" />
              )}
              <div className="xylo-manage-jobs-card-content">
                <div className="xylo-manage-jobs-card-header">
                  <div className={`xylo-manage-jobs-company-icon xylo-icon-${job.icon.toLowerCase()}`}>{job.icon}</div>
                  <div className="xylo-manage-jobs-header-text">
                    <div className="xylo-manage-jobs-company">{job.communitytype}</div>
                    <div className="xylo-manage-jobs-date">
                      {new Date(job.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="xylo-manage-jobs-card-actions">
                    <FaTrash className="xylo-manage-jobs-delete-icon" onClick={(e) => handleDelete(job.id, e)} />
                    <FaEllipsisV className="xylo-manage-jobs-ellipsis" />
                  </div>
                </div>
                <div className="xylo-manage-jobs-details">
                  <p className="xylo-manage-jobs-description">{job.description}</p>
                  <div className="xylo-manage-jobs-tags">
                    {job.tags.map((tag, index) => (
                      tag && <span key={`${tag}-${index}`} className="xylo-manage-jobs-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="xylo-manage-jobs-card-footer">
                  {job.sourcelink && (
                    <a href={job.sourcelink} target="_blank" rel="noopener noreferrer" className="xylo-manage-jobs-source-link">
                      View Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="xylo-manage-jobs-pagination">
        <button className="xylo-manage-jobs-pagination-btn">Previous</button>
        <button className="xylo-manage-jobs-pagination-btn xylo-active">1</button>
        <button className="xylo-manage-jobs-pagination-btn">2</button>
        <button className="xylo-manage-jobs-pagination-btn">3</button>
        <button className="xylo-manage-jobs-pagination-btn">Next</button>
      </div>
      
      </main>
    </div>
  );
};

export default ManageJobsUniqueXylo;
