import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to handle sending the OTP
  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/forget-password', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending OTP');
      setMessage('');
    }
  };

  // Function to handle resetting the password
  const handleResetPassword = async () => {
    try {
      const response = await axios.put('http://localhost:5000/reset-password', { // Changed to PUT
        email,
        otp,
        newPassword,
      });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button onClick={handleSendOtp}>Send OTP</button>
      </div>

      <div className="form-group">
        <label>OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      <button onClick={handleResetPassword}>Reset Password</button>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ResetPasswordPage;
