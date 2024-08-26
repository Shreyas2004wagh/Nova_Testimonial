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
  const [generatedLink, setGeneratedLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCopiedModal, setShowCopiedModal] = useState(false);
  const [loading, setLoading] = useState(false);
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
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User ID is not found in local storage. Please log in again.");
      setLoading(true); 
      return;
    }
  
    const formattedData = {
      ...formData,
      questions: formData.questions.split(',').map((q) => q.trim()),
      user_Id: userId,
    };
  
    try {
      const response = await fetch('https://nova-testimonial.onrender.com/addSpace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        if (response.status === 400) {
          const result = await response.json();
          alert(result.message); // Show error message from the server
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        const result = await response.json();
        const link = result.link;
        setGeneratedLink(link);
        setShowModal(true);
  
        // Save the generated link in session storage
        sessionStorage.setItem('generatedLink', link);
  
        // Make a request to add the link to the Space document in the database
        await fetch(`https://nova-testimonial.onrender.com/space/${formData.publicUrl}/addLink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ link }),
        });
  
        setFormData({
          spacename: '',
          publicUrl: '',
          headerTitle: '',
          customMessage: '',
          questions: '',
          starRatings: false,
        });
  
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create space. Check console for details.');
    } finally {
      setLoading(false); 
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setShowModal(false);
      setShowCopiedModal(true);
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 10000);

      return () => clearTimeout(timer);
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

      {showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Space Created Successfully!</h2>
      <p>Your space link has been generated:</p>
      <p className="generated-link">{generatedLink}</p>
      <button onClick={handleCopyLink} className="copy-button">Copy Link to Clipboard</button>
      {[...Array(9)].map((_, index) => (
        <div key={index} className="ribbon"></div>
      ))}
    </div>
  </div>
)}

      {showCopiedModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Link Copied!</h2>
            <p>Your space link has been copied to the clipboard:</p>
            <p className="generated-link">{generatedLink}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceForm;
