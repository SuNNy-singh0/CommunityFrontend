import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaRegBell,
  FaGoogle,
  FaApple,
  FaMicrosoft,
  FaFacebook,
  FaSearch,
  FaArrowRight,
  FaEnvelope
} from "react-icons/fa";
import "./DreamTechRoleUniqueXylo.css";
import { Helmet } from 'react-helmet-async';
// No fallback data - we'll handle errors directly in the UI

export default function DreamTechRoleUniqueXylo() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  
  // Image popup state
  const [popupImage, setPopupImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  
  // Featured employers state with career page links
  const [featuredEmployers, setFeaturedEmployers] = useState([
    { icon: <FaGoogle />, name: "Google", careerLink: "https://careers.google.com/" },
    { icon: <FaApple />, name: "Apple", careerLink: "https://www.apple.com/careers/" },
    { icon: <FaMicrosoft />, name: "Microsoft", careerLink: "https://careers.microsoft.com/" },
    { icon: <FaFacebook />, name: "Meta", careerLink: "https://www.metacareers.com/" },
    { name: "Amazon", careerLink: "https://www.amazon.jobs/" },
    { name: "Netflix", careerLink: "https://jobs.netflix.com/" },
    { name: "Tesla", careerLink: "https://www.tesla.com/careers" },
    { name: "IBM", careerLink: "https://www.ibm.com/careers" },
    { name: "Oracle", careerLink: "https://www.oracle.com/careers/" },
    { name: "Intel", careerLink: "https://jobs.intel.com/" }
  ]);

  // Salary insights state
  const [salaryInsights, setSalaryInsights] = useState([
    { role: "Frontend Developer", percent: 80, color: "#6c63ff" },
    { role: "Backend Developer", percent: 60, color: "#ff6584" },
    { role: "Fullstack Developer", percent: 40, color: "#43e97b" },
    { role: "DevOps Engineer", percent: 20, color: "#ffd86f" }
  ]);

  // Fetch all jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://asliengineers.com/jobs/all");
      setJobs(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs. Please try again later.");
      setJobs([]); // Set empty array instead of fallback data
    } finally {
      setLoading(false);
    }
  };

  // Format job data from API to match our component structure
  const formatJobData = (job) => {
    // Extract location from description or use default
    const locationMatch = job.description?.match(/in\s([\w\s,]+)/i);
    const location = locationMatch ? locationMatch[1] : "Remote";
    
    // Determine company name and format it
    const company = job.communitytype || "Tech Company";
    
    // Format time since posting
    const postedDate = new Date(job.date);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    let timeAgo;
    if (diffDays > 0) {
      timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      timeAgo = `${diffHours > 0 ? diffHours : 1} hour${diffHours > 1 ? 's' : ''} ago`;
    }

    // Determine if job is remote
    const isRemote = job.description?.toLowerCase().includes("remote") || false;
    
    // Generate badges
    const badges = [];
    if (isRemote) badges.push("Remote");
    if (diffHours < 24) badges.push("New");
    if (job.description?.toLowerCase().includes("urgent")) badges.push("Urgent");

    // Determine company icon
    const companyLower = company.toLowerCase();
    let companyIcon = null;
    
    return {
      id: job.id || Math.random().toString(36).substr(2, 9),
      title: job.description?.split('\n')[0] || "Tech Position",
      company: `${company} · ${location}`,
      tags: job.tag || ["Tech"],
      salary: "$100K - $150K", // Default salary range if not provided
      image: job.postimagelink || null,
      badges: badges,
      time: timeAgo,
      sourceLink: job.sourcelink
    };
  };

  // Filter jobs based on search term and active filter
  const filteredJobs = jobs
    .map(formatJobData)
    .filter(job => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      let matchesFilter = true;
      if (activeFilter === "Remote") {
        matchesFilter = job.badges.includes("Remote");
      } else if (activeFilter === "Latest") {
        matchesFilter = job.time.includes("hour") || job.time.includes("1 day");
      } else if (activeFilter === "Intern") {
        matchesFilter = job.title.toLowerCase().includes("intern");
      } else if (activeFilter === "On-Site") {
        matchesFilter = !job.badges.includes("Remote");
      }
      
      return matchesSearch && matchesFilter;
    });

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter click
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Open job source link in new tab
  const openJobLink = (sourceLink) => {
    if (sourceLink) {
      window.open(sourceLink, '_blank');
    }
  };

  // Handle image click to show popup
  const handleImageClick = (e, imageUrl) => {
    e.stopPropagation(); // Prevent job card click event
    setPopupImage(imageUrl);
    setShowPopup(true);
  };

  // Close popup when clicking outside
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
    <Helmet>
        <title>Tech Jobs & Internships for Engineers | Asli Engineers Job Board</title>
        <meta
          name="description"
          content="Find your dream tech role with Asli Engineers. Explore the latest full-time jobs and internships in software development, MERN, DSA, Java, and more, updated daily."
        />
        <meta
          name="keywords"
          content="tech jobs, engineering jobs, software jobs, internship, tech roles, developer jobs, MERN jobs, DSA jobs, Java jobs, remote jobs, entry-level tech jobs, senior developer jobs, tech career, India tech jobs, asli engineers jobs"
        />
        <link rel="canonical" href="https://www.asliengineers.com/techjob" /> {/* Assuming this component is at /jobs */}

        {/* Open Graph Tags */}
        <meta property="og:title" content="Tech Jobs & Internships for Engineers | Asli Engineers Job Board" />
        <meta property="og:description" content="Find your dream tech role with Asli Engineers. Explore the latest full-time jobs and internships in software development, MERN, DSA, Java, and more, updated daily." />
        <meta property="og:image" content="https://www.asliengineers.com/images/jobs-listing-social.jpg" /> {/* Replace with a relevant image for the jobs page */}
        <meta property="og:url" content="https://www.asliengineers.com/jobs" />
        <meta property="og:type" content="website" />
      </Helmet>
    <div className="xylo-dream-bg">
      {/* Image Popup */}
      {showPopup && (
        <div className="xylo-dream-image-popup-overlay" onClick={closePopup}>
          <div className="xylo-dream-image-popup-content">
            <img src={popupImage} alt="Enlarged view" className="xylo-dream-image-popup-img" />
            <button className="xylo-dream-image-popup-close" onClick={closePopup}>×</button>
          </div>
        </div>
      )}
      <div className="xylo-dream-header">
        <h2>Find Your Dream Tech Role</h2>
        <p className="xylo-dream-sub">Explore jobs & internships handpicked for developers, updated daily.</p>
        <div className="xylo-dream-searchbar">
          <FaSearch className="xylo-dream-searchicon" />
          <input 
            type="text" 
            placeholder="Search by keyword, company, or tech stack..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      {/* <div className="xylo-dream-filters-row">
        <div className="xylo-dream-filters">
          <span 
            className={`xylo-dream-filter ${activeFilter === 'All' ? 'xylo-dream-filter-active' : ''}`}
            onClick={() => handleFilterClick('All')}
          >All</span>
          <span 
            className={`xylo-dream-filter ${activeFilter === 'Latest' ? 'xylo-dream-filter-active' : ''}`}
            onClick={() => handleFilterClick('Latest')}
          >Latest</span>
          <span 
            className={`xylo-dream-filter ${activeFilter === 'Remote' ? 'xylo-dream-filter-active' : ''}`}
            onClick={() => handleFilterClick('Remote')}
          >Remote</span>
          <span 
            className={`xylo-dream-filter ${activeFilter === 'Intern' ? 'xylo-dream-filter-active' : ''}`}
            onClick={() => handleFilterClick('Intern')}
          >Intern</span>
          <span 
            className={`xylo-dream-filter ${activeFilter === 'On-Site' ? 'xylo-dream-filter-active' : ''}`}
            onClick={() => handleFilterClick('On-Site')}
          >On-Site</span>
        </div>
        <div className="xylo-dream-location">
          <FaMapMarkerAlt />
          <span>Location</span>
        </div>
        <div className="xylo-dream-login-signup">
          <button className="xylo-dream-btn xylo-dream-btn-outline">Sign In</button>
          <button className="xylo-dream-btn">Sign Up</button>
        </div>
      </div> */}
      <div className="xylo-dream-main-content">
        <div className="xylo-dream-jobs">
          <div className="xylo-dream-jobs-header">
            <h3>Latest Jobs <span className="xylo-dream-jobs-count">({filteredJobs.length})</span></h3>
            <div className="xylo-dream-jobs-sort">
              <span>Sort:</span>
              <select>
                <option>Relevance</option>
                <option>Latest</option>
                <option>Salary (High to Low)</option>
              </select>
            </div>
          </div>
          <div className="xylo-dream-jobs-list">
            {loading ? (
              <div className="xylo-dream-loading">
                <div className="xylo-dream-spinner"></div>
                <p>Loading jobs...</p>
              </div>
            ) : error ? (
              <div className="xylo-dream-error">
                <p>{error}</p>
                <button className="xylo-dream-btn" onClick={fetchJobs}>Try Again</button>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="xylo-dream-no-jobs">
                <p>No jobs found matching your criteria.</p>
                <button className="xylo-dream-btn" onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('All');
                }}>Clear Filters</button>
              </div>
            ) : (
              currentJobs.map(job => (
              <div key={job.id} className="xylo-dream-job-card" onClick={() => openJobLink(job.sourceLink)}>
                {job.image && (
                  <img 
                    src={job.image} 
                    alt="office" 
                    className="xylo-dream-job-img"
                    onClick={(e) => handleImageClick(e, job.image)}
                  />
                )}
                <div className="xylo-dream-job-content">
                  <div className="xylo-dream-job-title-row">
                    <h4>{job.title}</h4>
                    <span className="xylo-dream-job-time">{job.time}</span>
                  </div>
                  <div className="xylo-dream-job-company">{job.company}</div>
                  <div className="xylo-dream-job-tags">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="xylo-dream-job-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="xylo-dream-job-bottom-row">
                    {/* <div className="xylo-dream-job-badges">
                      {job.badges.map((badge, i) => (
                        <span key={i} className="xylo-dream-job-badge">{badge}</span>
                      ))}
                    </div> */}
                    
                    <button className="xylo-dream-job-apply">View & Apply</button>
                  </div>
                </div>
              </div>
            )))
            }
          </div>
          <div className="xylo-dream-pagination">
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
              <span 
                key={i + 1}
                className={`xylo-dream-pagination-btn ${currentPage === i + 1 ? 'xylo-dream-pagination-btn-active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </span>
            ))}
            {totalPages > 3 && (
              <span 
                className="xylo-dream-pagination-btn"
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              >
                Next <FaArrowRight />
              </span>
            )}
          </div>
        </div>
        <div className="xylo-dream-sidebar">
          <div className="xylo-dream-sidebar-section xylo-dream-sidebar-alerts">
            <div className="xylo-dream-sidebar-title"><FaRegBell /> Subscribe to Job Alerts</div>
            <p>Get the latest remote tech jobs matching your skills in your inbox.</p>
            <div className="xylo-dream-sidebar-input-row">
              <input type="email" placeholder="Enter your email" />
              <button className="xylo-dream-btn xylo-dream-btn-purple"><FaEnvelope /> Subscribe Now</button>
            </div>
          </div>
          <div className="xylo-dream-sidebar-section xylo-dream-sidebar-employers">
            <div className="xylo-dream-sidebar-title">Top company career page links</div>
            <div className="xylo-dream-sidebar-employers-grid">
              {featuredEmployers.map((emp, i) => (
                <a 
                  key={i} 
                  href={emp.careerLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="xylo-dream-company-link"
                >
                  {emp.icon && <span className="xylo-dream-company-icon">{emp.icon}</span>}
                  <span className="xylo-dream-company-name">{emp.name}</span>
                </a>
              ))}
            </div>
          </div>
          {/* <div className="xylo-dream-sidebar-section xylo-dream-sidebar-salary">
            <div className="xylo-dream-sidebar-title">Salary Insights</div>
            <div className="xylo-dream-sidebar-salary-list">
              {salaryInsights.map((item, i) => (
                <div key={i} className="xylo-dream-sidebar-salary-item">
                  <div className="xylo-dream-sidebar-salary-role">{item.role}</div>
                  <div className="xylo-dream-sidebar-salary-bar-bg">
                    <div className="xylo-dream-sidebar-salary-bar" style={{width: `${item.percent}%`, background: item.color}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
      <div className="xylo-dream-cta">
        <h4>Don't Miss Out! Get MCQs, Contests & Job Alerts In Your Inbox</h4>
        <p>Join our community of over 25,000+ engineers who receive weekly curated job & event alerts.</p>
        <div className="xylo-dream-cta-row">
          <input type="email" placeholder="Your email address" />
          <button className="xylo-dream-btn xylo-dream-btn-purple">Subscribe Now</button>
        </div>
      </div>
     
    </div>
  </>
  );
}
