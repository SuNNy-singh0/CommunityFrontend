import React from "react";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import "./JobAlertBannerUniqueXylo.css";

const JobAlertBannerUniqueXylo = () => {
  return (
    <div className="xylo-jobalert-mainwrap">
      <div className="xylo-jobalert-top">
        <h2 className="xylo-jobalert-title">
          Don't Miss Out! Get MCQs, Contests & Job Alerts In Your Inbox
        </h2>
        <div className="xylo-jobalert-subtitle">
          Subscribe To Receive Job Alerts Straight To Your Inbox. Stay Updated And Never Miss An Opportunity To Grow!
        </div>
        <div className="xylo-jobalert-formrow">
          <input
            type="email"
            className="xylo-jobalert-input"
            placeholder="Email Address"
          />
          <button className="xylo-jobalert-btn">Subscribe Now</button>
        </div>
        <img
          className="xylo-jobalert-illustration"
          src="/communityfoot.jpg"
          alt="Tech Community Illustration"
        />
      </div>
     
    </div>
  );
};

export default JobAlertBannerUniqueXylo;
