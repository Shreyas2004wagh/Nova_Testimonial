import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/SpaceDetails.css';

const SpaceDetails = () => {
  const [space, setSpace] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get publicUrl from session storage
  const publicUrl = JSON.parse(sessionStorage.getItem('selectedSpace'))?.publicUrl;

  useEffect(() => {
    if (!publicUrl) {
      navigate('/'); 
      return;
    }

    const fetchSpaceDetails = async () => {
      try {
        // Fetch space details
        const response = await fetch(`http://localhost:5000/space/${publicUrl}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setSpace(result);

        // Fetch feedback details
        const feedbackResponse = await fetch(`http://localhost:5000/space/${publicUrl}/feedbackDetails`);
        if (!feedbackResponse.ok) {
          throw new Error(`HTTP error! status: ${feedbackResponse.status}`);
        }
        const feedbackResult = await feedbackResponse.json();
        setFeedback(feedbackResult);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceDetails();
  }, [publicUrl, navigate]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => navigate('/')} className="retry-button">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-details">
      {space ? (
        <>
          <h1>{space.spacename}</h1>
          {space.img && (
            <img 
              src={space.img} 
              alt={`${space.spacename} image`} 
              className="space-image" 
            />
          )}
          <p><strong>Header Title:</strong> {space.headerTitle}</p>
          <p><strong>Custom Message:</strong> {space.customMessage}</p>
          <h2>Questions</h2>
          <ul>
            {space.questions && space.questions.length > 0 ? (
              space.questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))
            ) : (
              <p>No questions available.</p>
            )}
          </ul>
          <h2>Feedback</h2>
          {feedback.length === 0 ? (
            <p>No feedback available for this space.</p>
          ) : (
            <div className="feedback-section">
              {feedback.map((fb, index) => (
                <div className="feedback-card" key={index}>
                  <h4>{fb.name}</h4>
                  <p><strong>Email:</strong> {fb.email}</p>
                  <div className="response">
                    {fb.responses && fb.responses.length > 0 ? (
                      fb.responses.map((response, idx) => (
                        <p key={idx}>
                          <strong>Question:</strong> {response.question}<br />
                          <strong>Answer:</strong> {response.answer}
                        </p>
                      ))
                    ) : (
                      <p>No responses available.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>No space details available.</div>
      )}
    </div>
  );
};

export default SpaceDetails;
