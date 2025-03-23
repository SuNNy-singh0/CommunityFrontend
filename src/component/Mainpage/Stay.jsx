import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaCalendar, FaClock, FaSignal, FaTrophy } from "react-icons/fa";
import './Mainpage.css';
import axios from 'axios';

function Stay() {
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });

    useEffect(() => {
        // Fetch contest details using Axios
        axios.get("http://localhost:8080/contests/all") // Adjust API as per your backend
            .then(response => {
                setContest(response.data);
                setLoading(false);
                initializeTimer(response.data.date, response.data.time);
            })
            .catch(error => {
                console.error("Error fetching contest:", error);
                setError(error.response?.data || "Failed to fetch contest details.");
                setLoading(false);
            });
        
    }, []);
   
    // Initialize countdown timer
    const initializeTimer = (date, time) => {
        const eventDate = new Date(`${date}T${time}:00+05:30`).getTime();

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
    };

    if (loading) return <p>Loading contest details...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <>
            <div className="contest-container">
                <div className="contest-card">
                    <div className="contest-header">
                        <h1 className="contest-title">{contest.heading}</h1>
                        <p className="contest-description">{contest.description}</p>
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
                        {contest.description}
                    </p>

                    <button className="register-button">
                        Register Now <FaArrowRight className="register-icon" />
                    </button>

                    <div className="contest-details">
                        <div className="detail-box">
                            <FaCalendar className="detail-icon" />
                            <h3 className="detail-title">Date & Time</h3>
                            <p className="detail-text">{contest.date} <br /> {contest.time} IST</p>
                        </div>
                        <div className="detail-box">
                            <FaClock className="detail-icon" />
                            <h3 className="detail-title">Duration</h3>
                            <p className="detail-text">{contest.duration} Minutes</p>
                        </div>
                        <div className="detail-box">
                            <FaSignal className="detail-icon" />
                            <h3 className="detail-title">Difficulty</h3>
                            <p className="detail-text">{contest.difficultyLevel}</p>
                        </div>
                        <div className="detail-box">
                            <FaTrophy className="detail-icon" />
                            <h3 className="detail-title">Prizes</h3>
                            <p className="detail-text">{contest.prizes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Stay;
