import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaCalendar, FaClock, FaSignal, FaTrophy } from "react-icons/fa";
import './Mainpage.css'
function Stay() {
    const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });

    useEffect(() => {
        const eventDate = new Date("2025-03-18T10:00:00+05:30").getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
                return;
            }

            const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
            const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
            const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0");

            setTimeLeft({ hours, minutes, seconds });
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(interval);
    }, []);
  return (
    <>
     {/* <div className='bannerlowerheading'>
      <p>Stay <span>Updated .... </span></p>
      </div> */}
      <div className="contest-container">
            <div className="contest-card">
                <div className="contest-header">
                    <h1 className="contest-title">DSA Contest: Coding Grip Test 2.0</h1>
                    <p className="contest-description">Put your DSA skills to the test! Compete and win exciting prizes.</p>
                </div>

                <div className="contest-timer">
                    <div className="timer-box">
                        <div className="timer-value">{timeLeft.hours}</div>
                        <div className="timer-label">HOURS</div>
                    </div>
                    <div className="timer-box">
                        <div className="timer-value">{timeLeft.minutes}</div>
                        <div className="timer-label">MINUTES</div>
                    </div>
                    <div className="timer-box">
                        <div className="timer-value">{timeLeft.seconds}</div>
                        <div className="timer-label">SECONDS</div>
                    </div>
                </div>

                <p className="contest-info">
                    Join the Coding Grip Test 2.0! A timed challenge where you solve DSA problems and prove your coding
                    expertise. Compete against others and become the ultimate DSA master!
                </p>

                <button className="register-button">
                    Register Now <FaArrowRight className="register-icon" />
                </button>

                <div className="contest-details">
                    <div className="detail-box">
                        <FaCalendar className="detail-icon" />
                        <h3 className="detail-title">Date & Time</h3>
                        <p className="detail-text">March 18, 2025<br />10:00 AM IST</p>
                    </div>
                    <div className="detail-box">
                        <FaClock className="detail-icon" />
                        <h3 className="detail-title">Duration</h3>
                        <p className="detail-text">90 Minutes</p>
                    </div>
                    <div className="detail-box">
                        <FaSignal className="detail-icon" />
                        <h3 className="detail-title">Difficulty</h3>
                        <p className="detail-text">Intermediate to Advanced</p>
                    </div>
                    <div className="detail-box">
                        <FaTrophy className="detail-icon" />
                        <h3 className="detail-title">Prizes</h3>
                        <p className="detail-text">Top 3 winners receive exclusive DSA resources and cash prizes</p>
                    </div>
                </div>
            </div>
        </div>
  
    </>
  )
}

export default Stay