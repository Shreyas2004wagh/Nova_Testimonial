import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader'; 
import './Styles/Login.css';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); // State to manage loader visibility
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      const response = await axios.post('https://nova-testimonial.onrender.com/login', {
        email: form.email,
        password: form.password,
      });

      setSuccess(response.data.message);
      setError('');

      localStorage.setItem('userEmailLogin', form.email);
      alert('Login successful');
      localStorage.setItem('userId', response.data._id);

      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
      setSuccess('');
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="login-container">
      {loading && <Loader />} 
      <div className="login-sidebar">
        <h1>Nova</h1>
        <p>Welcome to Nova</p>
        <p>Receive and manage all feedback from customers.</p>
        <a href="/signup">Don't have an account? Sign up</a>
      </div>
      <div className="login-form">
        <h2>Login</h2>
        <p>Provide your account information to continue.</p>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Eg. someone@gmail.com"
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
              placeholder="Enter a password"
              required
            />
            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
          </div>
          <button type="submit" className="submit-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
