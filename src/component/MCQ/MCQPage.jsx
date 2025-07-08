import React, { useState, useEffect } from "react";
import {
  FaCode,
  FaChartLine,
  FaMicroscope,
  FaClock,
  FaTimes,
  FaCoins,
  FaReact,
  FaJava,
} from "react-icons/fa";
import { getUser } from '../../utils/auth';
import "./MCQPage.css"; // Import normal CSS file

const MCQPage = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({
    MERN: false,
    DSA: false,
    JAVA: false,
  });
  const [selectedOptions, setSelectedOptions] = useState({
    MERN: null,
    DSA: null,
    JAVA: null,
  });
  const [mcqs, setMcqs] = useState({
    MERN: null,
    DSA: null,
    JAVA: null,
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const communityIcons = {
    MERN: <FaReact />,
    DSA: <FaCode />,
    JAVA: <FaJava />
  };

  // Check attempt status for each community
  const checkAttemptStatus = async (username) => {
    const communities = ["MERN", "DSA", "JAVA"];
    const newStatus = { ...status };
    let attemptedCount = 0;

    for (const community of communities) {
      try {
        const response = await fetch(
          `https://buyproduct4u.org/mcq/attempt/status?community=${encodeURIComponent(community)}`,
          {
            headers: {
              'username': username
            }
          }
        );

        if (response.ok) {
          const text = await response.text();
          const hasAttempted = text.includes("has already attempted");
          newStatus[community] = hasAttempted;
          if (hasAttempted) {
            attemptedCount++;
          }
        }
      } catch (error) {
        console.error(`Error checking attempt status for ${community}:`, error);
      }
    }

    setStatus(newStatus);
    setProgress((attemptedCount / 3) * 100);
  };

  useEffect(() => {
    const fetchMCQs = async () => {
      setLoading(true);
      try {
        const user = getUser();
        if (!user || !user.username) {
          setFeedback("Please login first");
          setTimeout(() => setFeedback(""), 3000);
          setLoading(false);
          return;
        }

        // First check attempt status
        await checkAttemptStatus(user.username);

        const communities = ["MERN", "DSA", "JAVA"];
        const mcqData = {};
        
        for (const community of communities) {
          try {
            const response = await fetch(`https://buyproduct4u.org/mcq/daily/${community}`, {
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'username': user.username
              }
            });
            
            if (response.ok) {
              // Check if the response is JSON
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                // Ensure both question and options are present and options is not null
                if (data && data.question && Array.isArray(data.options) && data.options.length > 0) {
                  mcqData[community] = data;
                } else {
                  console.error(`Invalid MCQ data for ${community}:`, data);
                  mcqData[community] = null;
                }
              } else {
                const text = await response.text();
                console.error(`Non-JSON response for ${community}:`, text);
                mcqData[community] = null;
              }
            } else {
              // Handle non-200 responses
              const text = await response.text();
              console.error(`Failed to fetch MCQ for ${community}: ${text}`);
              mcqData[community] = null;
            }
          } catch (error) {
            console.error(`Error fetching MCQ for ${community}:`, error);
            mcqData[community] = null;
          }
        }
        
        setMcqs(mcqData);
      } catch (error) {
        console.error("Error fetching MCQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMCQs();
  }, []);

  const handleOptionSelect = (community, optionIndex) => {
    if (status[community]) return; // Don't allow changes if already attempted
    
    setSelectedOptions(prev => ({
      ...prev,
      [community]: optionIndex
    }));
  };

  const handleSelection = async (community) => {
    if (status[community]) return; // Prevent multiple attempts

    const user = getUser();
    if (!user || !user.username) {
      setFeedback("Please login first");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }

    // Get the selected answer
    const selectedIndex = selectedOptions[community];
    if (selectedIndex === null) {
      setFeedback("Please select an answer first");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }

    try {
      const response = await fetch(
        `https://buyproduct4u.org/mcq/attempt?community=${encodeURIComponent(community)}&answer=${encodeURIComponent(selectedIndex)}`, 
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'username': user.username
          }
        }
      );

      const text = await response.text();
      
      if (response.ok) {
        setStatus(prev => ({
          ...prev,
          [community]: true
        }));
        
        const attempted = Object.values({ ...status, [community]: true }).filter(val => val).length;
        setProgress((attempted / 3) * 100);
        
        // Extract coins from response
        const coinsMatch = text.match(/\+(\d+) Coins/);
        const coins = coinsMatch ? coinsMatch[1] : "30";
        
        setFeedback(text);
        setTimeout(() => setFeedback(""), 3000);
      } else {
        setFeedback(text || "Error attempting MCQ");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (error) {
      console.error("Error attempting MCQ:", error);
      setFeedback("Error attempting MCQ");
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="mcqpage-container">
        <div className="mcqpage-loading">Loading MCQs...</div>
      </div>
    );
  }

  // Add a submit button for each MCQ card
  const renderMCQCard = (community, mcq) => (
    <div key={community} className={`mcqcard ${!mcq ? 'mcqcard-error' : ''}`}>
      <div className="mcqcard-header">
        <div className="mcqcard-title">
          {communityIcons[community]}
          <span>{community} Community</span>
        </div>
        {mcq && (
          <span className={`mcqcard-status ${status[community] ? "mcqcard-attempted" : ""}`}>
            {status[community] ? "Attempted" : "Not Attempted"}
          </span>
        )}
      </div>
      {mcq ? (
        <>
          <div className="mcqcard-question">{mcq.question}</div>
          <div className="mcqcard-options">
            {mcq.options && mcq.options.map((option, index) => (
              <label key={index} className={`mcqcard-option ${status[community] ? 'mcqcard-option-disabled' : ''}`}>
                <input 
                  type="radio" 
                  name={`${community}-mcq`} 
                  checked={selectedOptions[community] === index}
                  onChange={() => handleOptionSelect(community, index)}
                  disabled={status[community]}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {!status[community] && selectedOptions[community] !== null && (
            <button 
              className="mcqcard-submit-btn"
              onClick={() => handleSelection(community)}
              disabled={status[community]}
            >
              Submit Answer
            </button>
          )}
          {status[community] && (
            <div className="mcqcard-submitted">
              <span>✓ Submitted</span>
              <span className="mcqcard-coins">Answer recorded!</span>
            </div>
          )}
        </>
      ) : (
        <div className="mcqcard-error-message">
          <div className="mcqcard-error-icon">❗</div>
          No MCQ available for today in this community
          <div className="mcqcard-error-subtext">Please check back tomorrow!</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mcqpage-container">
      {feedback && (
        <div className="mcqpage-feedback">
          <FaCoins className="coin-icon" />
          {feedback}
        </div>
      )}

      <div className="mcqpage-content">
        <div className="mcqpage-header">
          <div className="mcqpage-title">Daily Community MCQs</div>
          <div className="mcqpage-date">
            Today's Date: {new Date().toLocaleDateString("en-US")}
          </div>
        </div>
        <div className="mcqpage-progress">
          <div className="mcqpage-progress-title">Progress</div>
          <div className="mcqpage-progressbar">
            <div
              className="mcqpage-progressfill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mcqpage-progress-text">
            Questions attempted: {Object.values(status).filter(Boolean).length}/3
          </div>
        </div>
        <div className="mcqpage-grid">
          {Object.entries(mcqs).map(([community, mcq]) => renderMCQCard(community, mcq))}
        </div>
      </div>
    </div>
  );
};

export default MCQPage;
