import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Styles/SignUp.css';

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/SignUp', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNum: form.phoneNumber, // Ensure the key matches the backend schema
        password: form.password,
      });

      if (response.status === 201) {
        alert("Sign up successful!");
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
        });
        navigate('/create-space'); // Navigate to /create-space
      } else {
        alert("Sign up failed!");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(`Sign up failed: ${error.response.data.message}`);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-sidebar">
        <h1>Nova</h1>
        <p>Start taking customer feedback — easily.</p>
        <p>Get your account setup in just a few steps</p>
        <div className="signup-steps">
          <div className="step active">Account Information</div>
          <div className="step">Company Information</div>
          <div className="step">Choose Subscription</div>
          <div className="step">Make Payment</div>
        </div>
        <a href="/login">Have an account? Login</a>
      </div>
      <div className="signup-form">
        <h2>Account Information</h2>
        <p>Provide your personal information to get started.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
