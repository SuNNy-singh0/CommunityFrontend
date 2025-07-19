import React from "react";
import "./About.css";
import { FaUsers, FaLightbulb, FaHandshake, FaAward, FaChartLine } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-asli-engineers">
      {/* Hero Banner */}
      <div className="about-hero-banner">
        {/* Optional: Replace src with your own hero image or illustration */}
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
          alt="Diverse group of engineers collaborating"
          className="about-hero-image"
        />
        <div className="about-hero-title">
          <h1>About Asli Engineers</h1>
        </div>
      </div>

      {/* Our Story */}
      <section className="about-section">
        <h2>Our Story: Building the Real Engineering Community</h2>
        <p>
          In the vast and ever-evolving landscape of engineering, truly valuable insights, genuine connections, and clear career paths can often feel scattered and hard to find. We, the founders of Asli Engineers, experienced this firsthand. We envisioned a single, vibrant hub where engineers – from students taking their first steps to seasoned professionals navigating complex challenges – could find authentic knowledge, meaningful support, and tangible opportunities.
        </p>
        <p>
          That vision became Asli Engineers. Launched with a passion for real engineering, real problems, and real solutions, our platform was built to bridge the gaps in traditional learning and networking. We believe that the most profound growth happens when brilliant minds connect, share, and challenge each other.
        </p>
      </section>

      {/* Our Mission */}
      <section className="about-section about-mission">
        <h2>Our Mission: Empowering Engineers for a Brighter Future</h2>
        <p>
          At Asli Engineers, our mission is to cultivate India's most authentic and impactful engineering community. We are dedicated to providing a dynamic platform where every engineer can:
        </p>
        <ul>
          <li><strong>Learn & Grow:</strong> Access high-quality, practical content, daily challenges, and insights from industry leaders.</li>
          <li><strong>Connect & Collaborate:</strong> Network with peers, mentors, and experts, fostering a culture of mutual growth and support.</li>
          <li><strong>Advance Careers:</strong> Discover relevant job opportunities, refine skills, and prepare for the next step in their professional journey.</li>
        </ul>
        <p>
          We aim to be the definitive resource for every engineer committed to excellence and continuous learning.
        </p>
      </section>

      {/* What Makes Asli Engineers Unique? */}
      <section className="about-section about-unique">
        <h2>What Makes Asli Engineers Unique?</h2>
        <ul>
          <li><strong>Authenticity is Core:</strong> "Asli" isn't just a name; it's our philosophy. We prioritize genuine discussions, verified insights, and practical applications over superficial trends.</li>
          <li><strong>Community-Driven Growth:</strong> Our platform thrives on the active participation and contributions of its members, ensuring that the knowledge shared is relevant and impactful.</li>
          <li><strong>Holistic Development:</strong> From daily MCQs to system design insights, from contest challenges to job listings, we cover the spectrum of an engineer's needs.</li>
          <li><strong>Expert-Led Content:</strong> Our platform is enriched by contributions from experienced professionals who have navigated the real-world challenges of engineering.</li>
        </ul>
      </section>

      {/* Our Values */}
      <section className="about-section about-values">
        <h2>Our Values: The Pillars of Our Community</h2>
        <div className="about-values-list">
          <div className="about-value-item"><FaAward className="about-value-icon" /><strong>Excellence:</strong> We strive for quality in every piece of content, every discussion, and every feature we offer.</div>
          <div className="about-value-item"><FaHandshake className="about-value-icon" /><strong>Collaboration:</strong> We believe in the power of collective intelligence and foster an environment where sharing and learning are celebrated.</div>
          <div className="about-value-item"><FaUsers className="about-value-icon" /><strong>Integrity:</strong> Honesty, respect, and ethical conduct guide all our interactions.</div>
          <div className="about-value-item"><FaLightbulb className="about-value-icon" /><strong>Innovation:</strong> We encourage curiosity, experimentation, and the pursuit of new knowledge and technologies.</div>
          <div className="about-value-item"><FaChartLine className="about-value-icon" /><strong>Impact:</strong> Our ultimate goal is to enable tangible growth and success for every member of our community.</div>
        </div>
      </section>
    </div>
  );
};

export default About;
