import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaTimes,
  FaClock,
  FaBriefcase,
  FaBuilding,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "./JobBoard.css"; // Import CSS file
import { Navigate } from "react-router-dom";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Fetch all jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/jobs/all");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Filter jobs by date
  const handleDateFilter = async (filter) => {
    try {
      const today = new Date();
      let startDate = new Date();
      
      switch (filter) {
        case "Last 24 hours":
          startDate.setDate(today.getDate() - 1);
          break;
        case "Last 7 days":
          startDate.setDate(today.getDate() - 7);
          break;
        case "Last 30 days":
          startDate.setDate(today.getDate() - 30);
          break;
        default:
          return;
      }

      const response = await axios.get(`http://localhost:8080/jobs/filter-by-date`, {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        }
      });
      setJobs(response.data);
      setDateFilter(filter);
      updateActiveFilters(filter);
    } catch (error) {
      console.error("Error filtering jobs by date:", error);
    }
  };

  // Update active filters
  const updateActiveFilters = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Remove filter
  const removeFilter = (filter) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
    if (filter === jobType) {
      setJobType("");
    }
    if (filter === dateFilter) {
      setDateFilter("");
    }
    fetchJobs(); // Reset to all jobs
  };

  // Filter jobs by search term
  const filteredJobs = jobs.filter(job => 
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.communitytype.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="jobboard-container">
      {/* Search & Filters */}
      <div className="jobboard-searchfilters">
        <div className="jobboard-searchbox">
          <FaSearch className="jobboard-searchicon" />
          <input
            type="text"
            placeholder="Search job title or company..."
            className="jobboard-searchinput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="jobboard-filters">
          <select 
            className="jobboard-select"
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
              if (e.target.value) updateActiveFilters(e.target.value);
            }}
          >
            <option value="">Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
          </select>
          <select 
            className="jobboard-select"
            value={dateFilter}
            onChange={(e) => handleDateFilter(e.target.value)}
          >
            <option value="">Date Posted</option>
            <option value="Last 24 hours">Last 24 hours</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="jobboard-activefilters">
        {activeFilters.map((filter, index) => (
          <span key={index} className="jobboard-filterbadge">
            {filter} <FaTimes className="jobboard-closeicon" onClick={() => removeFilter(filter)} />
          </span>
        ))}
      </div>

      {/* Job Listings */}
      <div className="jobboard-listings">
        {currentJobs.map((job, index) => (
          <JobCard
            key={index}
            // title={job.communitytype}
            // company={job.tag.join(", ")}
            // location="Remote"
            image={job.postimagelink || "https://via.placeholder.com/150"}
            description={job.description}
            tags={job.tag}
            posted={new Date(job.date).toLocaleDateString()}
            sourceLink={job.sourcelink}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="jobboard-pagination">
        <button 
          className={`jobboard-pagebutton ${currentPage === 1 ? 'jobboard-disabled' : ''}`}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <div className="jobboard-pages">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`jobboard-pagenumber ${currentPage === i + 1 ? 'jobboard-activepage' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button 
          className={`jobboard-pagebutton ${currentPage === totalPages ? 'jobboard-disabled' : ''}`}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ title, company, location, image, description, tags, posted, sourceLink }) => {
  return (
    <div className="jobboard-card" >
      <div className="jobboard-cardcontent">
        <img src={image} alt="Company logo" className="jobboard-cardimage" />
        <div className="jobboard-cardinfo">
          
          
          <p className="jobboard-carddescription">{description}</p>
          <div className="jobboard-tags">
            {tags.map((tag, index) => (
              <span key={index} className="jobboard-tag">{tag}</span>
            ))}
          </div>
          <div className="jobboard-posted">
            <div style={{
                fontSize:"16px",
                marginLeft:'10px'
            }}> 
            <FaClock className="jobboard-clockicon" size={20}/> {posted}
            </div>
            
           <a href={sourceLink}> <button className="btn btn-success" >Source Link</button></a>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
