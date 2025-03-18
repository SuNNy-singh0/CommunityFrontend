import React, { useState } from 'react'
import "./Mainpage.css";
import { FaPlus, FaMinus } from "react-icons/fa";
function FAQ() {
    const faqs = [
        { question: "Why should you join this community ??", answer: "This service provides helpful information about our platform, features, and how to use them.", isOpen: false },
        { question: "What is interval of contest ?? ", answer: "Our platform connects users with relevant services and tools to enhance productivity.", isOpen: false },
        { question: "What Contest Prize Redeem", answer: "Getting started is easy! Simply sign up for an account and follow our quick onboarding process.", isOpen: true },
    ];
    const [faqList, setFaqList] = useState(faqs);

    const toggleFAQ = (index) => {
        setFaqList((prevFaqs) =>
            prevFaqs.map((faq, i) => ({
                ...faq,
                isOpen: i === index ? !faq.isOpen : false,
            }))
        );
    };
  return (
<>
<div className="faq-container">
            <div className="faq-header">
                <h1 className="faq-title">Frequently Query in Mind</h1>
                <div className="faq-underline"></div>
            </div>

            <div className="faq-list">
                {faqList.map((faq, index) => (
                    <div key={index} className={`faq-item ${faq.isOpen ? "faq-open" : ""}`}>
                        <button className="faq-question" onClick={() => toggleFAQ(index)}>
                            <span className="faq-text">{faq.question}</span>
                            {faq.isOpen ? <FaMinus className="faq-icon" /> : <FaPlus className="faq-icon" />}
                        </button>
                        {faq.isOpen && <div className="faq-answer">{faq.answer}</div>}
                    </div>
                ))}
            </div>
        </div>
</>
  )
}

export default FAQ