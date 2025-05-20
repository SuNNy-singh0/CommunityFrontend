import React from 'react';
import './JobBoardUniqueZephyr.css';
import { FaSearch, FaMapMarkerAlt, FaBookmark, FaRegClock, FaChevronLeft, FaChevronRight, FaGoogle, FaMicrosoft, FaApple, FaPlay, FaFacebook } from 'react-icons/fa';
import { IoFilterSharp } from 'react-icons/io5';
import { MdOutlineSort } from 'react-icons/md';

const JobBoardUniqueZephyr = () => {
  // Sample job data
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Google Inc.',
      location: 'San Francisco, CA',
      timePosted: '10 min',
      description: 'We are looking for a Senior Frontend Developer with React.js experience. You will be working on high-impact projects with a great team.',
      skills: ['React', 'Redux', 'JavaScript'],
      salaryMin: '$120K',
      salaryMax: '$150K',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'Microsoft',
      location: 'Seattle, WA',
      timePosted: '30 min',
      description: 'We are looking for a Backend Developer with Node.js experience. You will be working on scalable solutions for our cloud services.',
      skills: ['Python', 'Node.js', 'MongoDB'],
      salaryMin: '$110K',
      salaryMax: '$140K',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      timePosted: '1h ago',
      description: 'Join our team to develop innovative solutions for streaming services. Experience with full-stack development required.',
      skills: ['React', 'Node.js', 'AWS'],
      salaryMin: '$125K',
      salaryMax: '$170K',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Austin, TX',
      timePosted: '2h ago',
      description: 'Looking for a DevOps engineer to help automate our infrastructure. Experience with cloud platforms required.',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      salaryMin: '$115K',
      salaryMax: '$160K',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 5,
      title: 'Mobile Developer (iOS)',
      company: 'Apple',
      location: 'Cupertino, CA',
      timePosted: '4h ago',
      description: 'Create beautiful, fast and native iOS apps. You will be working on the next generation of mobile applications.',
      skills: ['Swift', 'Objective-C', 'iOS'],
      salaryMin: '$130K',
      salaryMax: '$180K',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 6,
      title: 'Data Engineer',
      company: 'Facebook',
      location: 'Menlo Park, CA',
      timePosted: '1d ago',
      description: 'Help us transform raw data into actionable insights. You will be working with large datasets and building data pipelines.',
      skills: ['Python', 'SQL', 'Spark'],
      salaryMin: '$140K',
      salaryMax: '$190K',
      image: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
  ];

  // Salary insights data
  const salaryInsights = [
    { role: 'Software Engineer', salary: '$120K' },
    { role: 'Frontend Developer', salary: '$110K' },
    { role: 'Backend Developer', salary: '$115K' },
    { role: 'Full Stack Developer', salary: '$125K' },
    { role: 'DevOps Engineer', salary: '$130K' }
  ];

  return (
    <div className="zephyr-jobboard-container">
      <div className="zephyr-jobboard-header">
        <h1>Find Your Dream Tech Role</h1>
        <p>Optimize job searching experience for developer's perfect role</p>
        
        <div className="zephyr-jobboard-search-box">
          <FaSearch className="zephyr-jobboard-search-icon" />
          <input 
            type="text" 
            placeholder="Search: keywords, company or job title..." 
            className="zephyr-jobboard-search-input"
          />
        </div>
      </div>

      <div className="zephyr-jobboard-filter-section">
        <div className="zephyr-jobboard-filter-left">
          <div className="zephyr-jobboard-total-jobs">
            <span className="zephyr-jobboard-total-count">All</span>
        
          </div>
          <div className="zephyr-jobboard-filter-pill">
            <span>Last 24h</span>
          </div>
          <div className="zephyr-jobboard-filter-pill">
            <span>Remote</span>
          </div>
          <div className="zephyr-jobboard-filter-pill">
            <span>$100K+</span>
          </div>
        </div>
        
        <div className="zephyr-jobboard-filter-right">
          <div className="zephyr-jobboard-filter-button">
            <IoFilterSharp />
            <span>Filters</span>
          </div>
          <div className="zephyr-jobboard-sort-button">
            <MdOutlineSort />
            <span>Sort</span>
          </div>
        </div>
      </div>

      <div className="zephyr-jobboard-tags-container">
        {['JavaScript', 'Python', 'React', 'Node.js', 'Angular', 'Vue.js', 'TypeScript', 'MongoDB', 'PostgreSQL', '+ More'
        ].map((tag, index) => (
          <div key={index} className={`zephyr-jobboard-tag zephyr-jobboard-tag-${index}`}>
            {tag}
          </div>
        ))}
      </div>

      <div className="zephyr-jobboard-content">
        <div className="zephyr-jobboard-main">
          <div className="zephyr-jobboard-main-header">
            <h2>Latest Jobs (243)</h2>
            <div className="zephyr-jobboard-sort-options">
              <span>Sort by:</span>
              <span className="zephyr-jobboard-sort-selected">Relevance</span>
            </div>
          </div>

          <div className="zephyr-jobboard-job-list">
            {jobs.map(job => (
              <div key={job.id} className="zephyr-jobboard-job-card">
                <div className="zephyr-jobboard-job-image">
                  <img src={job.image} alt={job.company} />
                </div>
                <div className="zephyr-jobboard-job-content">
                  <div className="zephyr-jobboard-job-header">
                    <h3>{job.title}</h3>
                    <span className="zephyr-jobboard-job-time">{job.timePosted}</span>
                  </div>
                  <div className="zephyr-jobboard-job-company">
                    <span>{job.company}</span>
                    <span className="zephyr-jobboard-job-location">
                      <FaMapMarkerAlt /> {job.location}
                    </span>
                  </div>
                  <p className="zephyr-jobboard-job-description">{job.description}</p>
                  <div className="zephyr-jobboard-job-skills">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="zephyr-jobboard-job-skill">{skill}</span>
                    ))}
                  </div>
                  <div className="zephyr-jobboard-job-footer">
                    <div className="zephyr-jobboard-job-salary">
                      {job.salaryMin} - {job.salaryMax}
                    </div>
                    <button className="zephyr-jobboard-apply-btn">Apply now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="zephyr-jobboard-pagination">
            <button className="zephyr-jobboard-pagination-prev">
              <FaChevronLeft /> Prev
            </button>
            <div className="zephyr-jobboard-pagination-numbers">
              <span className="zephyr-jobboard-pagination-active">1</span>
              <span>2</span>
              <span>3</span>
              <span>...</span>
              <span>Next</span>
              <FaChevronRight />
            </div>
          </div>
        </div>

        <div className="zephyr-jobboard-sidebar">
          <div className="zephyr-jobboard-subscribe">
            <h3>Subscribe to Job Alerts</h3>
            <p>Get notified when new jobs matching your criteria are posted</p>
            <input type="email" placeholder="Your email address" />
            <div className="zephyr-jobboard-checkbox">
              <input type="checkbox" id="job-updates" />
              <label htmlFor="job-updates">I want job updates</label>
            </div>
            <button className="zephyr-jobboard-subscribe-btn">Subscribe</button>
          </div>

          <div className="zephyr-jobboard-featured-companies">
            <h3>Featured Employers</h3>
            <div className="zephyr-jobboard-company-logos">
              <div className="zephyr-jobboard-company-logo"><FaGoogle /></div>
              <div className="zephyr-jobboard-company-logo"><FaMicrosoft /></div>
              <div className="zephyr-jobboard-company-logo"><FaApple /></div>
              <div className="zephyr-jobboard-company-logo"><FaPlay /></div>
              <div className="zephyr-jobboard-company-logo"><FaFacebook /></div>
            </div>
            <p>100+ Top Company</p>
          </div>

          <div className="zephyr-jobboard-salary-insights">
            <h3>Salary Insights</h3>
            <p>National Average</p>
            
            {salaryInsights.map((item, index) => (
              <div key={index} className="zephyr-jobboard-salary-item">
                <div className="zephyr-jobboard-salary-role">{item.role}</div>
                <div className="zephyr-jobboard-salary-progress">
                  <div className={`zephyr-jobboard-salary-bar zephyr-jobboard-salary-bar-${index}`}></div>
                </div>
                <div className="zephyr-jobboard-salary-amount">{item.salary}</div>
              </div>
            ))}
            
            <p className="zephyr-jobboard-salary-footer">Data is based on real salaries</p>
          </div>
        </div>
      </div>

      <div className="zephyr-jobboard-footer-banner">
        <div className="zephyr-jobboard-banner-content">
          <h2>Don't Miss Out! Get MCQs, Contests & Job Alerts in Your Inbox</h2>
          <p>Join our community of tech-savvy professionals and never miss an opportunity!</p>
          
          <div className="zephyr-jobboard-banner-buttons">
            <button className="zephyr-jobboard-banner-btn-secondary">No, thank you</button>
            <button className="zephyr-jobboard-banner-btn-primary">Subscribe Now</button>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default JobBoardUniqueZephyr;
