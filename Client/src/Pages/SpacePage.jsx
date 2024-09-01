import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Styles/SpacePage.css";

const SpacePage = () => {
  const { publicUrl } = useParams();
  const [spaceData, setSpaceData] = useState(null);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    responses: [],
    feedbackType: 'text', // Added to handle feedback type
    video: null, // Added to handle video file
  });

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await fetch(`https://nova-testimonial.onrender.com/space/${publicUrl}`);
        if (!response.ok) {
          throw new Error('Space not found');
        }
        const data = await response.json();
        setSpaceData(data);
        setFeedback((prevFeedback) => ({
          ...prevFeedback,
          responses: Array(data.questions.length).fill(''),
        }));
      } catch (error) {
        console.error('Error fetching space data:', error);
        alert('Error fetching space data');
      }
    };

    fetchSpaceData();
  }, [publicUrl]);

  const handleFeedbackChange = (index, value) => {
    const updatedResponses = [...feedback.responses];
    updatedResponses[index] = value;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      responses: updatedResponses,
    }));
  };

  const handleFeedbackTypeChange = (e) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      feedbackType: e.target.value,
      video: null, // Reset video when feedback type changes
    }));
  };

  const handleVideoChange = (e) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      video: e.target.files[0], // Store the video file
    }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', feedback.name);
    formData.append('email', feedback.email);
    formData.append('feedbackType', feedback.feedbackType);
    formData.append('responses', JSON.stringify(feedback.responses));

    if (feedback.video) {
      formData.append('video', feedback.video);
    }

    const response = await fetch(`http://localhost:5000/space/${publicUrl}/feedback`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Feedback submitted successfully!');
      setFeedback({
        name: '',
        email: '',
        responses: Array(spaceData.questions.length).fill(''),
        feedbackType: 'text',
        video: null,
      });
    } else {
      alert('Failed to submit feedback.');
    }
  };

  if (!spaceData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{spaceData.headerTitle}</h1>
      <p>{spaceData.customMessage}</p>

      <form onSubmit={handleSubmitFeedback}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={feedback.name}
            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={feedback.email}
            onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Feedback Type</label>
          <select
            value={feedback.feedbackType}
            onChange={handleFeedbackTypeChange}
            required
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
          </select>
        </div>

        {feedback.feedbackType === 'video' && (
          <div>
            <label>Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
            />
          </div>
        )}

        {spaceData.questions.map((question, index) => (
          <div key={index}>
            <label>{question}</label>
            <textarea
              value={feedback.responses[index]}
              onChange={(e) => handleFeedbackChange(index, e.target.value)}
              disabled={feedback.feedbackType === 'video'}
            />
          </div>
        ))}

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default SpacePage;
