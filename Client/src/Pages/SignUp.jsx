import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import Modal from "../Components/Modal";
import "./Styles/SignUp.css";

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // State to manage loader visibility
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [modalMessage, setModalMessage] = useState(""); // Modal message state
  const [otp, setOtp] = useState(""); // State to manage OTP input
  const [showOtpInput, setShowOtpInput] = useState(false); // State to manage OTP input visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
  
    try {
      const response = await axios.post(
        "https://nova-testimonial.onrender.com/SignUp",
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNum: form.phoneNumber,
          password: form.password,
        }
      );
  
      if (response.status === 201) {
        setModalMessage("OTP sent to your email. Please verify to complete signup.");
        setShowModal(true); // Show success modal for OTP verification
        // Here, you need to prompt the user to enter the OTP and verify it using a new function `verifyOtp`.
      } else {
        setModalMessage("Sign up failed!");
        setShowModal(true); // Show failure modal
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        setModalMessage(`Sign up failed: ${error.response.data.message}`);
      } else {
        setModalMessage("An error occurred. Please try again later.");
      }
      setShowModal(true); // Show error modal
    } finally {
      setLoading(false); // Hide loader
    }
  };
  
  // Function to verify OTP
  const verifyOtp = async (otp) => {
    try {
      const response = await axios.post(
        "https://nova-testimonial.onrender.com/verifyOtp",
        {
          email: form.email,
          otp: otp,
        }
      );
  
      if (response.status === 201) {
        setModalMessage("Sign up successful!");
        setShowModal(true);
        localStorage.setItem("userEmailSignup", form.email);
        localStorage.setItem("userId", response.data._id);
        setTimeout(() => {
          setShowModal(false);
          navigate("/dashboard"); // Navigate to dashboard
        }, 2000);
      } else {
        setModalMessage("OTP verification failed!");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setModalMessage("An error occurred. Please try again later.");
      setShowModal(true);
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  return (
    <div className="signup-container">
      {loading && <Loader />} {/* Loader */}
      {showModal && (
        <Modal message={modalMessage} onClose={handleCloseModal} />
      )} {/* Modal */}

      <div className="signup-sidebar">
        <h1>Welcome to Nova</h1>
        <p>Nova helps you gather and manage customer feedback effortlessly.</p>
        <p>
          Create your account to start collecting valuable insights that improve
          your business.
        </p>
        <p>
          Already have an account? <a href="/login">Log in here</a>
        </p>
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
