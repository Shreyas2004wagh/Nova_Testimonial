import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/SpaceForm.css';

const SpaceForm = () => {
  const [formData, setFormData] = useState({
    spacename: '',
    publicUrl: '',
    headerTitle: '',
    customMessage: '',
    questions: '',
    starRatings: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      questions: formData.questions.split(',').map((q) => q.trim()), // Convert comma-separated questions into an array
    };

    try {
      const response = await fetch('http://localhost:5000/addSpace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Space created successfully!');
      
      // Clear the form after successful submission
      setFormData({
        spacename: '',
        publicUrl: '',
        headerTitle: '',
        customMessage: '',
        questions: '',
        starRatings: false,
      });

      setIsSubmitted(true); // Set the submission state to true

      console.log(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create space. Check console for details.');
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Redirect after 2 seconds

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [isSubmitted, navigate]);

  return (
    <div className="spaceform-container">
      <div className="spaceform-content">
        <h1>Create New Space</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Space Name</label>
            <input
              type="text"
              name="spacename"
              value={formData.spacename}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Public URL</label>
            <input
              type="text"
              name="publicUrl"
              value={formData.publicUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Header Title</label>
            <input
              type="text"
              name="headerTitle"
              value={formData.headerTitle}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Custom Message</label>
            <textarea
              name="customMessage"
              value={formData.customMessage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Questions (comma separated)</label>
            <input
              type="text"
              name="questions"
              value={formData.questions}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              Star Ratings
              <input
                type="checkbox"
                name="starRatings"
                checked={formData.starRatings}
                onChange={handleChange}
              />
            </label>
          </div>

          <button type="submit" className="submit-button">
            Create Space
          </button>
        </form>
        {isSubmitted && (
          <div className="redirect-container">
            <p>Redirecting to Dashboard...</p>
            <Link to="/dashboard" className="redirect-link">Go to Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceForm;
