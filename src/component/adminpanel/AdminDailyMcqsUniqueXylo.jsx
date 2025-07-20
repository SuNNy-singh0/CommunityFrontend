import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDailyMcqsUniqueXylo.css";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaCrown } from "react-icons/fa";

import { useNavigate } from 'react-router-dom';

const AdminDailyMcqsUniqueXylo = () => {
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState("All Communities");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [communities, setCommunities] = useState(["All Communities"]);

  // Date helpers
  const today = new Date("2025-07-05"); // Use the provided system date
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Fetch MCQs
  useEffect(() => {
    setLoading(true);
    axios.get("/api/mcq/all")
      .then(res => {
        setMcqs(res.data);
        // Extract unique communities
        const comms = Array.from(new Set(res.data.map(mcq => mcq.community)));
        setCommunities(["All Communities", ...comms]);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch MCQs");
        setLoading(false);
      });
  }, []);

  // Date filter logic
  function getDateLabel(mcqDate) {
    if (!mcqDate) return "";
    const d = new Date(mcqDate);
    if (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    ) return "Today";
    if (
      d.getFullYear() === tomorrow.getFullYear() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getDate() === tomorrow.getDate()
    ) return "Tomorrow";
    if (
      d.getFullYear() === dayAfterTomorrow.getFullYear() &&
      d.getMonth() === dayAfterTomorrow.getMonth() &&
      d.getDate() === dayAfterTomorrow.getDate()
    ) return "Day After Tomorrow";
    if (d < today) return "Older Date";
    return "Future Date";
  }

  // Filtered MCQs
  const filteredMcqs = mcqs.filter(mcq => {
    // Community filter
    if (selectedCommunity !== "All Communities" && mcq.community !== selectedCommunity) return false;
    // Date filter
    const label = getDateLabel(mcq.date);
    if (selectedDate !== "All Dates" && label !== selectedDate) return false;
    // Search filter
    if (
      search &&
      !mcq.question.toLowerCase().includes(search.toLowerCase()) &&
      !mcq.options.some(opt => opt.toLowerCase().includes(search.toLowerCase()))
    ) return false;
    return true;
  });

  // Delete MCQ
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/mcq/delete/${id}`);
      setMcqs(mcqs => mcqs.filter(mcq => mcq.id !== id));
    } catch (err) {
      alert("Failed to delete MCQ");
    }
  };

  // Date filter options
  const dateOptions = ["All Dates", "Older Date", "Today", "Tomorrow", "Day After Tomorrow"];

  return (
    <div className="xylo-daily-mcqs-container">
      <div className="xylo-daily-mcqs-layout">
        <aside className="xylo-daily-mcqs-sidenav">
          <nav className="xylo-daily-mcqs-sidenav-nav">
            <a className="xylo-daily-mcqs-sidenav-link" onClick={() => navigate('/admin')}>Dashboard</a>
            <a className="xylo-daily-mcqs-sidenav-link" onClick={() => navigate('/admin/allusers')}>All Users</a>
            <a className="xylo-daily-mcqs-sidenav-link" onClick={() => navigate('/admin/managejobs')}>Manage Jobs</a>
            <a className="xylo-daily-mcqs-sidenav-link" onClick={() => navigate('/admin/managecontests')}>Manage Contests</a>
            <a className="xylo-daily-mcqs-sidenav-link xylo-daily-mcqs-sidenav-link-active">Daily MCQs</a>
          </nav>
          <div className="xylo-daily-mcqs-sidenav-logout-row">
            <button className="xylo-daily-mcqs-sidenav-logout" onClick={() => navigate('/login')}>Logout</button>
          </div>
        </aside>
        <main className="xylo-daily-mcqs-main">
          <div className="xylo-daily-mcqs-header-row">
            <div className="xylo-daily-mcqs-title">Daily MCQs</div>
            <button className="xylo-daily-mcqs-upload-btn" onClick={()=>{
              navigate('/mcqform')
            }}>+ Upload MCQs</button>
          </div>
          <div className="xylo-daily-mcqs-filters">
            <input
              type="text"
              className="xylo-daily-mcqs-search"
              placeholder="Search MCQs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="xylo-daily-mcqs-community"
              value={selectedCommunity}
              onChange={e => setSelectedCommunity(e.target.value)}
            >
              {communities.map(comm => (
                <option key={comm} value={comm}>{comm}</option>
              ))}
            </select>
            <select
              className="xylo-daily-mcqs-date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            >
              {dateOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {/* MCQs List */}
          <div className="xylo-daily-mcqs-list">
            {loading ? (
              <div className="xylo-daily-mcqs-empty">Loading MCQs...</div>
            ) : error ? (
              <div className="xylo-daily-mcqs-empty">{error}</div>
            ) : filteredMcqs.length === 0 ? (
              <div className="xylo-daily-mcqs-empty">No MCQs found.</div>
            ) : (
              filteredMcqs.map((mcq, idx) => (
                <div className="xylo-daily-mcqs-card" key={mcq.id}>
                  <div className="xylo-daily-mcqs-card-header">
                    <span className={`xylo-daily-mcqs-label xylo-daily-mcqs-label-${mcq.community?.toLowerCase()}`}>{mcq.community}</span>
                    <span className="xylo-daily-mcqs-card-date">{getDateLabel(mcq.date)} ({mcq.date})</span>
                    <div className="xylo-daily-mcqs-card-actions">
                      <FaEdit className="xylo-daily-mcqs-icon xylo-daily-mcqs-edit" />
                      <FaTrash className="xylo-daily-mcqs-icon xylo-daily-mcqs-delete" onClick={() => handleDelete(mcq.id)} style={{cursor:'pointer'}}/>
                    </div>
                  </div>
                  <div className="xylo-daily-mcqs-question">{mcq.question}</div>
                  <div className="xylo-daily-mcqs-options">
                    {mcq.options.map((opt, i) => (
                      <label
                        key={i}
                        className={`xylo-daily-mcqs-option${mcq.correctAnswer == i ? " xylo-daily-mcqs-option-correct" : ""}`}
                      >
                        <input type="radio" name={`mcq-${mcq.id}`} checked={mcq.correctAnswer == i} readOnly />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <div className="xylo-daily-mcqs-card-footer">
                    <span className="xylo-daily-mcqs-scheduled">Scheduled for: {mcq.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Pagination (optional, not implemented for API data) */}
        </main>
      </div>
     
    </div>
  );
};

export default AdminDailyMcqsUniqueXylo;
