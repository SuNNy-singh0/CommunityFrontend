import React, { useState } from "react";
import { FaClock } from "react-icons/fa";
import "./DailyMCQ.css"; // Import CSS file

const DailyMCQ = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  // Sample Questions Data
  const questions = [
    {
      id: "q1",
      text: "What Is The Time Complexity Of QuickSort In The Worst Case?",
      options: ["O(N Log N)", "O(N²)", "O(N Log N)", "O(N)"],
    },
    {
      id: "q2",
      text: "What Is The Space Complexity Of QuickSort?",
      options: ["O(Log N)", "O(N)", "O(1)", "O(N²)"],
    },
    {
      id: "q3",
      text: "What Is The Best Way To Choose Pivot In QuickSort?",
      options: ["First Element", "Last Element", "Random Element", "Median of Three"],
    },
  ];

  // Handle MCQ Option Change
  const handleOptionChange = (questionId, option) => {
    setSelectedOptions({ ...selectedOptions, [questionId]: option });
  };

  return (
    <div className="mcq-container">
      {/* Header Section */}
      <div className="mcq-header">
        <h1 className="mcq-title">Stay <span>Consistent</span>. Solve <span>Daily</span>. Get <span>Ahead!</span></h1>
        {/* <p className="mcq-subtitle">
          Compete With Others, And Get Instant Explanations To Improve
        </p> */}
      </div>

      {/* MCQ Questions Section */}
      <div className="mcq-grid">
        {questions.map((question) => (
          <div key={question.id} className="mcq-card">
            <div className="mcq-question-header">
              <h3 className="mcq-question">{question.text}</h3>
              <div className="mcq-timer">
                <FaClock className="mcq-timer-icon" />
                <span>00:30</span>
              </div>
            </div>

            {/* Options */}
            <div className="mcq-options">
              {question.options.map((option, index) => (
                <label key={index} className="mcq-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={selectedOptions[question.id] === option}
                    onChange={() => handleOptionChange(question.id, option)}
                    className="mcq-radio"
                  />
                  <span className="mcq-option-text">{option}</span>
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mcq-submit-container">
              <button className="mcq-submit-btn">Submit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyMCQ;
