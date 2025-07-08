import React, { useState, useEffect, useCallback } from 'react';
import { FaBuilding, FaBriefcase, FaNetworkWired, FaMicrosoft, FaSearch, FaClock, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { SiGoogle, SiAmazon, SiMeta } from 'react-icons/si';
import './DreamTechJobUniqueXylo.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DreamTechJob = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false); // Set to false since we're using dummy data
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  // Dummy job data for companies
  const dummyJobs = [
    {
      company: 'Infosys',
      role: 'Full Stack Developer',
      date: new Date().toISOString(),
      sourcelink: 'https://www.infosys.com/careers/',
      tag: ['company:Infosys', 'Full Stack', 'JavaScript']
    },
    {
      company: 'HCL',
      role: 'DevOps Engineer',
      date: new Date().toISOString(),
      sourcelink: 'https://www.hcltech.com/careers',
      tag: ['company:HCL', 'DevOps', 'Cloud']
    },
    {
      company: 'Deloitte',
      role: 'Data Scientist',
      date: new Date().toISOString(),
      sourcelink: 'https://www2.deloitte.com/careers',
      tag: ['company:Deloitte', 'Data Science', 'AI']
    },
    {
      company: 'Cognizant',
      role: 'UI/UX Designer',
      date: new Date().toISOString(),
      sourcelink: 'https://careers.cognizant.com/',
      tag: ['company:Cognizant', 'UI/UX', 'Design']
    }
  ];

  // Set dummy data instead of fetching from API
  useEffect(() => {
    setFeaturedJobs(dummyJobs);
    setAllJobs(dummyJobs);
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://13.201.100.143:8080/jobs/featured");
      // If the featured endpoint doesn't exist, fallback to getting all jobs and taking the first 4
      if (!response.data || response.status !== 200) {
        const allJobsResponse = await axios.get("http://13.201.100.143:8080/jobs/all");
        setFeaturedJobs(allJobsResponse.data.slice(0, 4));
      } else {
        setFeaturedJobs(response.data.slice(0, 4));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching featured jobs:", error);
      // Fallback to fetching all jobs if featured endpoint fails
      try {
        const allJobsResponse = await axios.get("http://13.201.100.143:8080/jobs/all");
        setFeaturedJobs(allJobsResponse.data.slice(0, 4));
        setLoading(false);
      } catch (fallbackError) {
        console.error("Error fetching all jobs as fallback:", fallbackError);
        setError("Failed to load job listings. Please try again later.");
        setLoading(false);
      }
    }
  };

  const fetchAllJobs = async () => {
    try {
      const response = await axios.get("http://13.201.100.143:8080/jobs/all");
      setAllJobs(response.data);
    } catch (error) {
      console.error("Error fetching all jobs:", error);
    }
  };

  // Filter jobs by job type
  const handleJobTypeFilter = useCallback((type) => {
    if (type) {
      try {
        axios.get(`http://13.201.100.143:8080/jobs/filter-by-type?type=${type}`)
          .then(response => {
            setAllJobs(response.data);
            updateActiveFilters(type);
          })
          .catch(error => {
            console.error("Error filtering jobs by type:", error);
            // Fallback to client-side filtering if API endpoint doesn't exist
            fetchAllJobs().then(() => {
              setJobType(type);
              updateActiveFilters(type);
            });
          });
      } catch (error) {
        console.error("Error in job type filter:", error);
      }
    } else {
      fetchAllJobs();
    }
  }, []);

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
    fetchAllJobs(); // Reset to all jobs
  };

  // Filter jobs by search term (client-side)
  const getFilteredJobs = useCallback(() => {
    let filtered = [...allJobs];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.communitytype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tag?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply job type filter (if we're doing client-side filtering)
    if (jobType && !activeFilters.includes(jobType)) {
      filtered = filtered.filter(job => 
        job.tag?.some(tag => tag.toLowerCase().includes(jobType.toLowerCase()))
      );
    }
    
    return filtered;
  }, [allJobs, searchTerm, jobType, activeFilters]);

  // Function to render company icon based on company name
  const renderCompanyIcon = (companyName) => {
    const name = companyName?.toLowerCase() || '';
    if (name.includes('google')) return <SiGoogle className="xyloDreamTechJob_companyIcon google" />;
    if (name.includes('microsoft')) return <FaMicrosoft className="xyloDreamTechJob_companyIcon msft" />;
    if (name.includes('amazon')) return <SiAmazon className="xyloDreamTechJob_companyIcon amzn" />;
    if (name.includes('meta') || name.includes('facebook')) return <SiMeta className="xyloDreamTechJob_companyIcon meta" />;
    if (name.includes('infosys')) return <FaBuilding className="xyloDreamTechJob_companyIcon infosys" />;
    if (name.includes('deloitte')) return <FaBuilding className="xyloDreamTechJob_companyIcon deloitte" />;
    if (name.includes('hcl')) return <FaBuilding className="xyloDreamTechJob_companyIcon hcl" />;
    if (name.includes('cognizant')) return <FaBuilding className="xyloDreamTechJob_companyIcon cognizant" />;
    return <FaBuilding className="xyloDreamTechJob_companyIcon" />;
  };

  // Function to extract company and role from job data
  const getCompanyAndRole = (job) => {
    // For dummy data, we can directly use the company and role properties
    if (job.company && job.role) {
      return { 
        company: job.company, 
        role: job.role.length > 20 ? job.role.substring(0, 20) + '...' : job.role 
      };
    }
    
    // Fallback to original logic for any API data
    const companyTag = job.tag?.find(tag => 
      tag.toLowerCase().includes('company:') || 
      tag.toLowerCase().includes('org:') ||
      tag.toLowerCase().includes('organization:')
    );
    
    let company = 'Company';
    if (companyTag) {
      company = companyTag.split(':')[1]?.trim() || company;
    }
    
    // Use community type as role or extract from description
    let role = job.communitytype || 'Role';
    if (role.length > 20) {
      role = role.substring(0, 20) + '...';
    }
    
    return { company, role };
  };

  return (
    <div className="xyloDreamTechJob_container">
      <div className="xyloDreamTechJob_left">
        <h2 className="xyloDreamTechJob_title">Find Your Dream Tech Job</h2>
        <p className="xyloDreamTechJob_desc">
          Discover opportunities at top tech companies. From startups to Fortune 500s, find the perfect role for your career growth.
        </p>
        
       
        {/* Active filters - similar to JobBoard.jsx */}
        {activeFilters.length > 0 && (
          <div className="xyloDreamTechJob_activefilters">
            {activeFilters.map((filter, index) => (
              <span key={index} className="xyloDreamTechJob_filterbadge">
                {filter} <FaTimes className="xyloDreamTechJob_closeicon" onClick={() => removeFilter(filter)} />
              </span>
            ))}
          </div>
        )}
        
        <div className="xyloDreamTechJob_statsRow">
          <div className="xyloDreamTechJob_stat"><FaBuilding className="xyloDreamTechJob_icon" /> {allJobs.length}+ Jobs Available</div>
          <div className="xyloDreamTechJob_stat"><FaBriefcase className="xyloDreamTechJob_icon" /> {getFilteredJobs().length} Matching Jobs</div>
          <div className="xyloDreamTechJob_stat"><FaNetworkWired className="xyloDreamTechJob_icon" /> Updated Daily</div>
        </div>
        <button className="xyloDreamTechJob_btn" onClick={() => navigate('/techjob')}>Explore All Opportunities</button>
      </div>
      <div className="xyloDreamTechJob_right">
        {loading ? (
          <div className="xyloDreamTechJob_loading">Loading job listings...</div>
        ) : error ? (
          <div className="xyloDreamTechJob_error">{error}</div>
        ) : (
          <>
            <div className="xyloDreamTechJob_cardRow">
              {dummyJobs.slice(0, 2).map((job, index) => {
                const { company, role } = getCompanyAndRole(job);
                return (
                  <div 
                    key={index} 
                    className={`xyloDreamTechJob_card ${index === 0 ? 'xyloDreamTechJob_card--highlight' : ''}`}
                    onClick={() => window.open(job.sourcelink, '_blank')}
                  >
                    {renderCompanyIcon(company)}
                    <div className="xyloDreamTechJob_company">{company}</div>
                    <div className="xyloDreamTechJob_role">{role}</div>
                    {job.date && (
                      <div className="xyloDreamTechJob_date">
                        <FaClock size={12} /> {new Date(job.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="xyloDreamTechJob_cardRow">
              {dummyJobs.slice(2, 4).map((job, index) => {
                const { company, role } = getCompanyAndRole(job);
                return (
                  <div 
                    key={index + 2} 
                    className="xyloDreamTechJob_card"
                    onClick={() => window.open(job.sourcelink, '_blank')}
                  >
                    {renderCompanyIcon(company)}
                    <div className="xyloDreamTechJob_company">{company}</div>
                    <div className="xyloDreamTechJob_role">{role}</div>
                    {job.date && (
                      <div className="xyloDreamTechJob_date">
                        <FaClock size={12} /> {new Date(job.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DreamTechJob;
