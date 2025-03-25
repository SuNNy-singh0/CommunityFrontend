import React, { useState } from 'react';
import axios from 'axios';
import './MCQform.css';

const MCQform = () => {
    const [formData, setFormData] = useState({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        community: '',
        date: new Date().toISOString().split('T')[0], // Default to today's date
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Transform the data to match backend structure
            const mcqData = {
                question: formData.question,
                options: [
                    formData.optionA,
                    formData.optionB,
                    formData.optionC,
                    formData.optionD
                ],
                correctAnswer: formData.correctAnswer,
                community: formData.community,
                date: formData.date
            };

            const response = await axios.post('http://localhost:8080/mcq/upload', mcqData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setMessage({ text: response.data, type: 'success' });
            // Clear form after successful submission
            setFormData({
                question: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                correctAnswer: '',
                community: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            setMessage({ 
                text: error.response?.data || 'Failed to upload MCQ', 
                type: 'error' 
            });
        }
    };

    return (
        <div className="mcq-form-container">
            <h2>Upload Daily MCQ</h2>
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mcq-form">
                <div className="form-group">
                    <label htmlFor="community">Community</label>
                    <select
                        id="community"
                        name="community"
                        value={formData.community}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Community</option>
                        <option value="JAVA">Java</option>
                        <option value="MERN">MERN</option>
                        <option value="DSA">DSA</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="question">Question</label>
                    <textarea
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="optionA">Option A</label>
                    <input
                        type="text"
                        id="optionA"
                        name="optionA"
                        value={formData.optionA}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="optionB">Option B</label>
                    <input
                        type="text"
                        id="optionB"
                        name="optionB"
                        value={formData.optionB}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="optionC">Option C</label>
                    <input
                        type="text"
                        id="optionC"
                        name="optionC"
                        value={formData.optionC}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="optionD">Option D</label>
                    <input
                        type="text"
                        id="optionD"
                        name="optionD"
                        value={formData.optionD}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="correctAnswer">Correct Answer</label>
                    <select
                        id="correctAnswer"
                        name="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Correct Answer</option>
                        <option value="0">Option A</option>
                        <option value="1">Option B</option>
                        <option value="2">Option C</option>
                        <option value="3">Option D</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">
                    Upload MCQ
                </button>
            </form>
        </div>
    );
};

export default MCQform; 