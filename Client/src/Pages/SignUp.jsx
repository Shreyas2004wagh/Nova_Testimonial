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
  const [showModal, setShowModal] = useState(false);
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
        alert("Sign up successful!");
        localStorage.setItem("userEmailSignup", form.email);
        localStorage.setItem("userId", response.data._id);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
        });
        navigate("/dashboard");
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
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="signup-container">
      {loading && <Loader />}
      {showModal && (
        <Modal
          message="Sign up successful! Please log in."
          onClose={handleCloseModal}
        />
      )}
     <div className="signup-sidebar">
  <h1>Welcome to Nova</h1>
  <p>Nova helps you gather and manage customer feedback effortlessly.</p>
  <p>Create your account to start collecting valuable insights that improve your business.</p>
  <p>Already have an account? <a href="/login">Log in here</a></p>
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
