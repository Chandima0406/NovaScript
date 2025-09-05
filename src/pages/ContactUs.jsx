import React, { useState } from 'react';
import '../styles/ContactUs.css';
import contactuspageimage from '../assets/contactuspageimage.png';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // Reset form after submission
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
    // Show success message or redirect
    alert('Your message has been submitted. We will get back to you soon!');
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us-content">
        <div className="contact-us-header">
          <h1>Contact Us</h1>
          <p>
            Have questions or need support? Connect with our team to learn more about NovaScript, get assistance, or
            share your feedback. We're here to help you enhance your research journey with smart, reliable, and AI-powered
            tools.
          </p>
        </div>
        
        <div className="contact-us-form-container">
          <div className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div className="name-inputs">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write Your Message Here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button className="submit-button" onClick={handleSubmit}>
              Submit Request
            </button>
          </div>
          
          <div className="contact-image">
            <img src={contactuspageimage} alt="Contact our team" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;