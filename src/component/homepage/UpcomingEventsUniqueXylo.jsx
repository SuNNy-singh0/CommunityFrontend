import React from "react";
import { FaRegCalendarAlt, FaRegBookmark, FaChevronLeft, FaChevronRight, FaShareAlt } from "react-icons/fa";
import "./UpcomingEventsUniqueXylo.css";

const eventsUniqueXyloData = [
  {
    id: 1,
    title: "Global Code Jam 2025",
    type: "Hackathon",
    typeColor: "#a259f7",
    img: "/dsa.png",
    date: "May 15-16, 2025 · 09:00 AM - 06:00 PM",
    desc:
      "Join the biggest coding competition of the year! Solve challenging problems, collaborate with peers, and win amazing prizes including job opportunities a...",
    tags: [
      { label: "Algorithms", color: "#7b8cff" },
      { label: "Data Structures", color: "#2ecc71" },
      { label: "Problem Solving", color: "#ffe066", textColor: "#333" },
    ],
    regProgress: 60,
    timeLeft: { days: 5, hours: 12, mins: 42 },
    btn: "Register Now",
    btnColor: "#a259f7",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    type: "Workshop",
    typeColor: "#3b82f6",
    img: "/React.png",
    date: "May 10, 2025 · 10:00 AM - 04:00 PM",
    desc:
      "Learn advanced React patterns from industry experts. This workshop covers performance optimization, state management, custom hooks, and advanced...",
    tags: [
      { label: "React", color: "#7b8cff" },
      { label: "Frontend", color: "#2ecc71" },
      { label: "JavaScript", color: "#ffe066", textColor: "#333" },
    ],
    regProgress: 25,
    timeLeft: { days: 2, hours: 8, mins: 27 },
    btn: "Register Now",
    btnColor: "#2563eb",
  },
];

const UpcomingEventsUniqueXylo = () => {
  return (
    <div className="xylo-events-mainwrap">
      <div className="xylo-events-headerrow">
        <span className="xylo-events-title">Upcoming Events</span>
        <div className="xylo-events-arrows">
          <button className="xylo-events-arrow xylo-events-arrowleft"><FaChevronLeft /></button>
          <button className="xylo-events-arrow xylo-events-arrowright"><FaChevronRight /></button>
        </div>
      </div>
      <div className="xylo-events-cardswrap">
        {eventsUniqueXyloData.map((event) => (
          <div className="xylo-events-card" key={event.id}>
            <div className="xylo-events-imgwrap">
              <img src={event.img} alt={event.title} className="xylo-events-img" />
             
              <button className="xylo-events-sharebtn"><FaShareAlt /></button>
            </div>
            <div className="xylo-events-content">
              <div className="xylo-events-title-row">{event.title}</div>
              <div className="xylo-events-date"><FaRegCalendarAlt className="xylo-events-dateicon" /> {event.date}</div>
              <div className="xylo-events-desc">{event.desc}</div>
              <div className="xylo-events-tags">
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="xylo-events-tag"
                    style={{ background: tag.color, color: tag.textColor || '#fff' }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="xylo-events-regrow">
                <span className="xylo-events-reglbl">Registration closes in:</span>
                <div className="xylo-events-regbarwrap">
                  <div className="xylo-events-regbarbg">
                    <div className="xylo-events-regbar" style={{width: event.regProgress + '%', background: event.btnColor}}></div>
                  </div>
                </div>
              </div>
              <div className="xylo-events-timerow">
                <span className="xylo-events-timer">
                  <b>{event.timeLeft.days}</b> days : <b>{event.timeLeft.hours}</b> hrs : <b>{event.timeLeft.mins}</b> min
                </span>
                <button className="xylo-events-savebtn"><FaRegBookmark /></button>
              </div>
              <button className="xylo-events-registerbtn" style={{background: event.btnColor}}>{event.btn}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsUniqueXylo;
