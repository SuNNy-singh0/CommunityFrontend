import React, { useState, useEffect } from "react";
import { FaClock, FaCoins } from "react-icons/fa";
import "./DailyMCQ.css";

const DailyMCQ = ({ username }) => {
  const communities = ["MERN", "DSA", "JAVA"];
  const [mcqs, setMcqs] = useState({
    MERN: null,
    DSA: null,
    JAVA: null
  });
  const [selectedOptions, setSelectedOptions] = useState({
    MERN: null,
    DSA: null,
    JAVA: null
  });
  const [status, setStatus] = useState({
    MERN: false,
    DSA: false,
    JAVA: false
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  // Time left until next midnight (reset)
  const [resetCountdown, setResetCountdown] = useState(getTimeUntilMidnight());

  function getTimeUntilMidnight() {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); // next 00:00:00
    const diff = nextMidnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds };
  }

  // Check attempt status for each community
  const checkAttemptStatus = async () => {
    if (!username) return;
    
    const newStatus = { ...status };
    let attemptedCount = 0;

    for (const community of communities) {
      try {
        const response = await fetch(
          `https://asliengineers.com/mcq/attempt/status?community=${encodeURIComponent(community)}`,
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
  };

  const fetchDailyMCQs = async () => {
    setLoading(true);
    setFeedback("");

    const mcqData = {};
    
    for (const community of communities) {
      try {
        const response = await fetch(`https://asliengineers.com/mcq/daily/${community}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'username': username
          }
        });
      
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data && data.question && Array.isArray(data.options) && data.options.length > 0) {
              mcqData[community] = {
                id: community,
                text: data.question,
                options: data.options
              };
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
    setLoading(false);
  };

  // Live countdown to midnight (reset)
  useEffect(() => {
    if (username) {
      fetchDailyMCQs();
      checkAttemptStatus();
    }
  }, [username]);

  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(() => {
      setResetCountdown(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initializeMCQs = async () => {
      setLoading(true);
      if (!username) {
        setFeedback("Please login to attempt the daily MCQs");
        setLoading(false);
        return;
      }

      try {
        await checkAttemptStatus();
        await fetchDailyMCQs();
      } catch (error) {
        console.error('Error initializing MCQs:', error);
        setFeedback("Error loading MCQs. Please try again.");
        setLoading(false);
      }
    };

    initializeMCQs();
  }, [username]);

  const handleOptionChange = (community, index) => {
    if (!status[community]) {
      setSelectedOptions(prev => ({
        ...prev,
        [community]: index
      }));
    }
  };

  const handleSubmit = async (community) => {
    if (selectedOptions[community] === null) {
      setFeedback("Please select an option");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }

    if (!username) {
      setFeedback("Please login to attempt the MCQ");
      return;
    }

    try {
      const response = await fetch(
        `https://asliengineers.com/mcq/attempt?community=${community}&answer=${encodeURIComponent(selectedOptions[community])}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'username': username
          }
        }
      );

      const text = await response.text();
      
      if (response.ok) {
        setStatus(prev => ({
          ...prev,
          [community]: true
        }));
        if (text.includes("Correct")) {
          const coinsMatch = text.match(/\+(\d+) Coins/);
          const coins = coinsMatch ? coinsMatch[1] : "30";
          setFeedback(`Correct! +${coins} Coins`);
        } else {
          setFeedback("Incorrect answer. Try again tomorrow!");
        }
      } else if (text.includes("already attempted")) {
        setStatus(prev => ({
          ...prev,
          [community]: true
        }));
        setFeedback("You have already attempted this MCQ");
      } else {
        setFeedback(text || "Error submitting answer");
      }
      
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setFeedback("Error submitting answer. Please try again.");
      setTimeout(() => setFeedback(""), 3000);
    }
  };

  if (loading) {
    return <div className="mcq-container"><div className="mcq-loading">Loading MCQs...</div></div>;
  }

  return (
    <div className="mcq-container">
      <div className="mcq-header">
        <h1 className="mcq-title">Stay <span>Consistent</span>. Solve <span>Daily</span>. Get <span>Ahead!</span></h1>
      </div>
      {feedback && (
        <div className="mcq-feedback"><FaCoins className="mcq-coins-icon" /> {feedback}</div>
      )}
      <div className="mcq-grid">
        {communities.map(community => {
          const mcq = mcqs[community];
          const isAttempted = status[community];
          
          return mcq ? (
            <div key={community} className="mcq-card">
              <div className="mcq-question-header">
                <h3 className="mcq-question">{mcq.text}</h3>
                
                <div className="mcq-timer">
                  <FaClock className="mcq-timer-icon" />
                  <span>
                    {`${resetCountdown.hours.toString().padStart(2, '0')}:${resetCountdown.minutes.toString().padStart(2, '0')}:${resetCountdown.seconds.toString().padStart(2, '0')}`} left
                  </span>
                </div>
              </div>
              <div className="mcq-options">
                {mcq.options.map((option, idx) => (
                  <label key={idx} className={`mcq-option${isAttempted ? ' mcq-option-disabled' : ''}`}>
                    <input
                      type="radio"
                      name={mcq.id}
                      value={option}
                      checked={selectedOptions[community] === idx}
                      onChange={() => handleOptionChange(community, idx)}
                      disabled={isAttempted}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {!isAttempted && (
                <button 
                  className="mcq-submit-btn" 
                  onClick={() => handleSubmit(community)} 
                  disabled={selectedOptions[community] === null || (resetCountdown.hours === 0 && resetCountdown.minutes === 0 && resetCountdown.seconds === 0)}
                >
                  Submit Answer
                </button>
              )}
              {isAttempted && (
                <div className="mcq-submitted">✓ Submitted</div>
              )}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default DailyMCQ;
