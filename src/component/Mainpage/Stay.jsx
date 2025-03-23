import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaCalendar, FaClock, FaSignal, FaTrophy } from "react-icons/fa";
import './Mainpage.css';
import axios from 'axios';

function Stay() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contestTimers, setContestTimers] = useState({});

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get("http://localhost:8080/contests/all");
                console.log('Contests data received:', response.data);
                
                if (response.data && response.data.length > 0) {
                    setContests(response.data);
                    // Initialize timers for each contest
                    const timers = {};
                    response.data.forEach(contest => {
                        if (contest.date && contest.time) {
                            const eventDate = new Date(`${contest.date}T${contest.time}`);
                            if (!isNaN(eventDate.getTime())) {
                                timers[contest.id] = {
                                    timeLeft: { hours: "00", minutes: "00", seconds: "00" },
                                    status: null
                                };
                                initializeTimer(eventDate, contest.id);
                            }
                        }
                    });
                    setContestTimers(timers);
                } else {
                    setError("No contests available");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching contests:", error);
                setError(error.message || "Failed to fetch contest details");
                setLoading(false);
            }
        };

        fetchContests();
        
        // Cleanup timers on unmount
        return () => {
            Object.values(contestTimers).forEach(timer => {
                if (timer.interval) {
                    clearInterval(timer.interval);
                }
            });
        };
    }, []);

    const initializeTimer = (eventDate, contestId) => {
        const updateTimer = () => {
            const now = new Date();
            const distance = eventDate.getTime() - now.getTime();

            if (distance < 0) {
                setContestTimers(prev => ({
                    ...prev,
                    [contestId]: {
                        ...prev[contestId],
                        timeLeft: { hours: "00", minutes: "00", seconds: "00" },
                        status: "This event has already passed"
                    }
                }));
                return false;
            }

            const hours = String(Math.floor(distance / (1000 * 60 * 60))).padStart(2, "0");
            const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
            const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0");

            setContestTimers(prev => ({
                ...prev,
                [contestId]: {
                    ...prev[contestId],
                    timeLeft: { hours, minutes, seconds },
                    status: null
                }
            }));
            return true;
        };

        if (updateTimer()) {
            const interval = setInterval(() => {
                if (!updateTimer()) {
                    clearInterval(interval);
                }
            }, 1000);

            setContestTimers(prev => ({
                ...prev,
                [contestId]: {
                    ...prev[contestId],
                    interval: interval
                }
            }));
        }
    };

    if (loading) return (
        <div className="contest-container">
            <div className="contest-card">
                <div className="loading">Loading contest details...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="contest-container">
            <div className="contest-card">
                <div className="error-message">{error}</div>
            </div>
        </div>
    );

    if (contests.length === 0) return (
        <div className="contest-container">
            <div className="contest-card">
                <div className="no-contest">No contests available</div>
            </div>
        </div>
    );

    return (
        <div className="contests-list">
            {contests.map(contest => (
                <div key={contest.id} className="contest-container">
                    <div className="contest-card">
                        <div className="contest-header">
                            <h1 className="contest-title">{contest.heading || 'Contest Title'}</h1>
                            <p className="contest-description">{contest.description || 'No description available'}</p>
                        </div>

                        {!contest.date || !contest.time ? (
                            <div className="timer-error">Date or time not available for this contest</div>
                        ) : contestTimers[contest.id]?.status ? (
                            <div className="event-status">{contestTimers[contest.id].status}</div>
                        ) : (
                            <div className="contest-timer">
                                <div className="timer-box">
                                    <div className="timer-value">{contestTimers[contest.id]?.timeLeft.hours || "00"}</div>
                                    <div className="timer-label">HOURS</div>
                                </div>
                                <div className="timer-box">
                                    <div className="timer-value">{contestTimers[contest.id]?.timeLeft.minutes || "00"}</div>
                                    <div className="timer-label">MINUTES</div>
                                </div>
                                <div className="timer-box">
                                    <div className="timer-value">{contestTimers[contest.id]?.timeLeft.seconds || "00"}</div>
                                    <div className="timer-label">SECONDS</div>
                                </div>
                            </div>
                        )}

                        <button className="register-button">
                            Register Now <FaArrowRight className="register-icon" />
                        </button>

                        <div className="contest-details">
                            <div className="detail-box">
                                <FaCalendar className="detail-icon" />
                                <h3 className="detail-title">Date & Time</h3>
                                <p className="detail-text">{contest.date || 'Not specified'} <br /> {contest.time || 'Not specified'} IST</p>
                            </div>
                            <div className="detail-box">
                                <FaClock className="detail-icon" />
                                <h3 className="detail-title">Duration</h3>
                                <p className="detail-text">{contest.duration || 'Not specified'} Minutes</p>
                            </div>
                            <div className="detail-box">
                                <FaSignal className="detail-icon" />
                                <h3 className="detail-title">Difficulty</h3>
                                <p className="detail-text">{contest.difficultyLevel || 'Not specified'}</p>
                            </div>
                            <div className="detail-box">
                                <FaTrophy className="detail-icon" />
                                <h3 className="detail-title">Prizes</h3>
                                <p className="detail-text">{contest.prizes || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Stay;
