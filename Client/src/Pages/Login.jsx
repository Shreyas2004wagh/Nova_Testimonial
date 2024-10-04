import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader'; 
import Modal from '../Components/Modal'; 
import './Styles/Login.css';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: form.email,
        password: form.password,
      });

      setSuccess(response.data.message);
      setError('');
      localStorage.setItem('userEmailLogin', form.email);
      localStorage.setItem('userId', response.data._id);
      setShowModal(true);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/dashboard');
  };

  const handleResetPassword = () => {
    navigate('/reset-password');  // Redirect to reset password page
  };

  return (
    <div className="login-container">
      {loading && <Loader />} 
      {showModal && <Modal message="Login successful!" onClose={handleCloseModal} />}
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

        {/* Add Reset Password Button */}
        <button onClick={handleResetPassword} className="reset-password-button">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default Login;
