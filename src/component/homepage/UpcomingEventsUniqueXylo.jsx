import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Slider from 'react-slick';
import { FaRegCalendarAlt, FaRegBookmark, FaChevronLeft, FaChevronRight, FaShareAlt } from "react-icons/fa";
import "./UpcomingEventsUniqueXylo.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UpcomingEventsUniqueXylo = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/contests/all');
        const upcomingEvents = response.data.filter(event => new Date(event.date) > new Date());
        setEvents(upcomingEvents);
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const sliderSettings = {
    dots: false,
    infinite: events.length > 2,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
  };

  if (loading) return <div className="xylo-events-mainwrap"><p>Loading events...</p></div>;
  if (error) return <div className="xylo-events-mainwrap"><p>{error}</p></div>;

  return (
    <div className="xylo-events-mainwrap">
      <div className="xylo-events-headerrow">
        <span className="xylo-events-title">Upcoming Events</span>
        {events.length > 2 && (
            <div className="xylo-events-arrows">
                <button onClick={() => sliderRef.current.slickPrev()} className="xylo-events-arrow xylo-events-arrowleft"><FaChevronLeft /></button>
                <button onClick={() => sliderRef.current.slickNext()} className="xylo-events-arrow xylo-events-arrowright"><FaChevronRight /></button>
            </div>
        )}
      </div>
      
      <div className={`xylo-events-cardswrap ${events.length > 2 ? 'is-slider' : ''}`}>
        {events.length > 2 ? (
          <Slider ref={sliderRef} {...sliderSettings}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} onRegisterClick={handleRegisterClick} />
            ))}
          </Slider>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event} onRegisterClick={handleRegisterClick} />
          ))
        )}
      </div>
      {isModalOpen && (
        <RegistrationFormModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          eventName={selectedEvent?.heading} 
        />
      )}
    </div>
  );
};

const EventCard = ({ event, onRegisterClick }) => {
    const eventDate = new Date(event.date + 'T' + event.time);
    const timeLeft = eventDate - new Date();
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutesLeft = Math.floor((timeLeft / 1000 / 60) % 60);

    return (
        <div className="xylo-events-card">
            <div className="xylo-events-imgwrap">
                <img src={event.sourcelink} alt={event.heading} className="xylo-events-img" />
                <button className="xylo-events-sharebtn"><FaShareAlt /></button>
            </div>
            <div className="xylo-events-content">
                <div className="xylo-events-title-row">{event.heading}</div>
                <div className="xylo-events-date"><FaRegCalendarAlt className="xylo-events-dateicon" /> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · {event.time}</div>
                <div className="xylo-events-desc">{event.description}</div>
                <div className="xylo-events-tags">
                    <span className="xylo-events-tag" style={{ background: '#7b8cff' }}>{event.difficultyLevel}</span>
                    <span className="xylo-events-tag" style={{ background: '#2ecc71' }}>{event.communitytype}</span>
                </div>
                <div className="xylo-events-regrow">
                    <span className="xylo-events-reglbl">Prizes: {event.prizes}</span>
                </div>
                <div className="xylo-events-timerow">
                    <span className="xylo-events-timer">
                        <b>{daysLeft}</b> days : <b>{hoursLeft}</b> hrs : <b>{minutesLeft}</b> min
                    </span>
                    <button className="xylo-events-savebtn"><FaRegBookmark /></button>
                </div>
                <button onClick={() => onRegisterClick(event)} className="xylo-events-registerbtn" style={{background: '#2563eb'}}>Register Now</button>
            </div>
        </div>
    );
}

const RegistrationFormModal = ({ isOpen, onClose, eventName }) => {
  const [formData, setFormData] = useState({
    name: '',
    emailid: '',
    phonenumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      ...formData,
      eventname: eventName,
    };

    try {
      await axios.post('http://localhost:8080/event/create', payload);
      setSubmitStatus('success');
      setFormData({ name: '', emailid: '', phonenumber: '' });
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 2000); 
    } catch (error) {
      console.error('Registration failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="xylo-reg-modal-backdrop" onClick={onClose}>
      <div className="xylo-reg-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="xylo-reg-modal-close" onClick={onClose}>&times;</button>
        <h2>Register for {eventName}</h2>
        {submitStatus === 'success' ? (
          <div className="xylo-reg-modal-message success">Registration successful!</div>
        ) : submitStatus === 'error' ? (
          <div className="xylo-reg-modal-message error">Registration failed. Please try again.</div>
        ) : (
          <form onSubmit={handleSubmit} className="xylo-reg-modal-form">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="emailid" placeholder="Email Address" value={formData.emailid} onChange={handleChange} required />
            <input type="tel" name="phonenumber" placeholder="Phone Number" value={formData.phonenumber} onChange={handleChange} required />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsUniqueXylo;
