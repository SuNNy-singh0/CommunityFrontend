import React, { useState } from 'react';
import axios from 'axios';
import './ContestForm.css';

const ContestForm = () => {
    const [formData, setFormData] = useState({
        description: '',
        communityType: 'GENERAL',
        date: '',
        time: '',
        heading: '',
        duration: '',
        difficultyLevel: 'MEDIUM',
        prizes: '',
       
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const data = new FormData();
        if (file) {
            data.append('file', file);
        }
        data.append('description', formData.description);
        data.append('communitytype', formData.communityType);
        data.append('date', formData.date);
        data.append('time', formData.time);
        data.append('heading', formData.heading);
        data.append('duration', formData.duration);
        data.append('difficultyLevel', formData.difficultyLevel);
        data.append('prizes', formData.prizes);
        

        try {
            // IMPORTANT: Replace with your actual backend endpoint
            const response = await axios.post('http://localhost:8080/contests/post', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating contest. Please try again.');
        }
    };

    return (
        <div className="contest-form-xylo-container">
            <h2 className="contest-form-xylo-title">Create New Contest</h2>
            <form onSubmit={handleSubmit} className="contest-form-xylo-form">
                <div className="contest-form-xylo-group">
                    <label htmlFor="heading">Contest Heading</label>
                    <input type="text" id="heading" name="heading" value={formData.heading} onChange={handleChange} required />
                </div>

                <div className="contest-form-xylo-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
                </div>

                <div className="contest-form-xylo-group">
                    <label htmlFor="communityType">Community Type</label>
                    <select id="communityType" name="communityType" value={formData.communityType} onChange={handleChange}>
                        <option value="MERN">MERN</option>
                        <option value="DSA">DSA</option>
                        <option value="JAVA">JAVA </option>
                       
                    </select>
                </div>

                <div className="contest-form-xylo-group">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>

                <div className="contest-form-xylo-group">
                    <label htmlFor="time">Time</label>
                    <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>

                <div className="contest-form-xylo-group">
                    <label htmlFor="duration">Duration (in minutes)</label>
                    <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
                </div>

                <div className="contest-form-xylo-group">
                    <label htmlFor="difficultyLevel">Difficulty Level</label>
                    <select id="difficultyLevel" name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange}>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>

                <div className="contest-form-xylo-group">
                    <label htmlFor="prizes">Prizes</label>
                    <input type="text" id="prizes" name="prizes" value={formData.prizes} onChange={handleChange} required />
                </div>

                

                <div className="contest-form-xylo-group">
                    <label htmlFor="file">Image (Optional)</label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} />
                </div>

                <button type="submit" className="contest-form-xylo-submit-btn">Create Contest</button>

                {message && <p className="contest-form-xylo-message success">{message}</p>}
                {error && <p className="contest-form-xylo-message error">{error}</p>}
            </form>
        </div>
    );
};

export default ContestForm;


