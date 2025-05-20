import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import "./Contest.css";

const contestUltraUniqueData = [
  {
    id: 1,
    title: "Web Development Contest",
    desc: "Build innovative web applications in 48 hours using modern frameworks and tools.",
    date: "June 27, 2025 · 09:00 UTC",
    status: "Upcomming",
    statusType: "upcoming",
    time: { days: 11, hours: 4, mins: 31, secs: 25 },
    btn: "Join Now",
    img: "/react.png",
  },
  {
    id: 2,
    title: "Machine Learning Competition",
    desc: "Train models to solve real-world problems and showcase your ML expertise.",
    date: "May 20, 2025 · 10:00 UTC",
    status: "Upcoming",
    statusType: "upcoming",
    time: { days: 21, hours: 5, mins: 31, secs: 25 },
    btn: "Remind Me",
    img: "/communityfoot.jpg",
  },
  {
    id: 3,
    title: "Database Design Challenge",
    desc: "Design efficient database schemas and optimize queries for performance.",
    date: "May 25, 2025 · 15:00 UTC",
    status: "Upcoming",
    statusType: "upcoming",
    time: { days: 26, hours: 10, mins: 31, secs: 25 },
    btn: "Remind Me",
    img: "https://img.freepik.com/free-photo/night-sky-moon-flag_23-2148158555.jpg?w=740&t=st=1684846915~exp=1684847515~hmac=example3",
  },
  {
    id: 4,
    title: "Database Design Challenge 2",
    desc: "Design efficient database schemas and optimize queries for performance.",
    date: "May 25, 2025 · 15:00 UTC",
    status: "Upcoming",
    statusType: "upcoming",
    time: { days: 26, hours: 10, mins: 31, secs: 25 },
    btn: "Remind Me",
    img: "https://img.freepik.com/free-photo/night-sky-moon-flag_23-2148158555.jpg?w=740&t=st=1684846915~exp=1684847515~hmac=example3",
  }
];

function Contest() {
  return (
    <div className="contestUltraUnique-mainWrapper">
      <div className="contestUltraUnique-headerRow">
        <span className="contestUltraUnique-title">Upcoming Contests</span>
        <a href="#" className="contestUltraUnique-viewAll">View All</a>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={2}
        navigation={{
          nextEl: ".contestUltraUnique-arrowRight",
          prevEl: ".contestUltraUnique-arrowLeft",
        }}
        pagination={{ clickable: true, el: ".contestUltraUnique-dots" }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
          3000: { slidesPerView: 2 },
        }}
        className="contestUltraUnique-swiper"
      >
        {contestUltraUniqueData.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="contestUltraUnique-card">
              <div className="contestUltraUnique-imgBox">
                <img src={item.img} alt="contest banner" className="contestUltraUnique-img" />
                <span className={`contestUltraUnique-status contestUltraUnique-status-${item.statusType}`}>{item.status}</span>
                <span className="contestUltraUnique-moonText">邀大杯捡</span>
              </div>
              <div className="contestUltraUnique-content">
                <span className="contestUltraUnique-cardTitle">{item.title}</span>
                <span className="contestUltraUnique-dateRow">
                  <FaCalendarAlt className="contestUltraUnique-icon" /> {item.date}
                </span>
                <span className="contestUltraUnique-desc">{item.desc}</span>
                <div className="contestUltraUnique-timerBox">
                  <span className="contestUltraUnique-timerLabel">Time Remaining:</span>
                  <div className="contestUltraUnique-timerValues">
                    <span className="contestUltraUnique-timerVal"><span>{item.time.days}</span> Days</span>
                    <span className="contestUltraUnique-timerVal"><span>{item.time.hours}</span> Hours</span>
                    <span className="contestUltraUnique-timerVal"><span>{item.time.mins}</span> Mins</span>
                    <span className="contestUltraUnique-timerVal"><span>{item.time.secs}</span> Secs</span>
                  </div>
                </div>
                <button className="contestUltraUnique-btn">{item.btn}</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="contestUltraUnique-arrowLeft"><IoMdArrowRoundBack /></div>
        <div className="contestUltraUnique-arrowRight"><IoMdArrowRoundForward /></div>
        <div className="contestUltraUnique-dots"></div>
      </Swiper>
    </div>
  );
}

export default Contest;