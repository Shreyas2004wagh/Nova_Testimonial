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
  });

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/space/${publicUrl}`);
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

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5000/space/${publicUrl}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });

    if (response.ok) {
      alert('Feedback submitted successfully!');
      setFeedback({
        name: '',
        email: '',
        responses: Array(spaceData.questions.length).fill(''),
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

        {spaceData.questions.map((question, index) => (
          <div key={index}>
            <label>{question}</label>
            <textarea
              value={feedback.responses[index]}
              onChange={(e) => handleFeedbackChange(index, e.target.value)}
            />
          </div>
        ))}

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default SpacePage;