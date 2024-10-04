import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import './Styles/Dashboard.css';
import happyGif from '../Images/happy.gif';
import palmGif from '../Images/palm.gif';
import angryGif from '../Images/angry.gif';
import cryingGif from '../Images/crying.gif';
import treeImg from '../Images/Tree.svg';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textFeedbackCount, setTextFeedbackCount] = useState(0);
  const [videoFeedbackCount, setVideoFeedbackCount] = useState(0);
  const [cookieConsent, setCookieConsent] = useState(null); // Track cookie consent state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in local storage');
        }

        const response = await fetch(`http://localhost:5000/getSpacesByUserId/${userId}`);
        
        if (response.status === 404) {
          setSpaces([]);  // No spaces found, so set spaces to an empty array
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const result = await response.json();
          setSpaces(result);

          if (cookieConsent === 'accepted') {
            // Extract space names from the result and store them in cookies if consent is given
            const spaceNames = result.map(space => space.spacename);
            document.cookie = `spaceNames=${JSON.stringify(spaceNames)}; path=/; max-age=${24 * 60 * 60}`;
          }

          // Fetch feedback counts for the first space (if any spaces exist)
          if (result.length > 0) {
            const feedbackCountsResponse = await fetch(`http://localhost:5000/space/${result[0].publicUrl}/feedbackCounts`);
            if (!feedbackCountsResponse.ok) {
              throw new Error(`HTTP error! status: ${feedbackCountsResponse.status}`);
            }
            const feedbackCounts = await feedbackCountsResponse.json();
            setTextFeedbackCount(feedbackCounts.textFeedbackCount);
            setVideoFeedbackCount(feedbackCounts.videoFeedbackCount);
          }
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [cookieConsent]); // Dependency array includes cookieConsent

  const handleSpaceClick = (space) => {
    sessionStorage.setItem('selectedSpace', JSON.stringify(space));
    navigate('/space-details');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAcceptCookies = () => {
    setCookieConsent('accepted');
    localStorage.setItem('cookieConsent', 'accepted');
  };

  const handleRejectCookies = () => {
    setCookieConsent('rejected');
    localStorage.setItem('cookieConsent', 'rejected');
  };

  useEffect(() => {
    // Check for existing cookie consent in local storage
    const existingConsent = localStorage.getItem('cookieConsent');
    if (existingConsent) {
      setCookieConsent(existingConsent);
    }
  }, []);

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">
          <h1>Nova</h1>
        </div>
        <div className="nav-icons">
          <button className="profile-button" onClick={handleProfileClick}>
            <CgProfile size={40} />
          </button>
        </div>
      </nav>
      <header className="hero-section">
        <h1><mark>A robust way to get</mark> customer's feedbacks</h1>
        <p>Collect simple customer feedback throughout their journey, improve their experience to drive real change</p>
        <div className="cta-buttons">
          <button className="start-feedback">Start Collecting Feedback</button>
          <button className="see-how">See how it works</button>
        </div>
      </header>
      <section className="gifs">
        <img src={happyGif} alt="Happy" className="gif"/>
        <img src={palmGif} alt="Palm" className="gif"/>
        <img src={angryGif} alt="Angry" className="gif"/>
        <img src={cryingGif} alt="Crying" className="gif"/>
      </section>
      <section className="overview">
        <h2>Overview</h2>
        <div className="overview-cards">
          <div className="card video-feedback">
            <h3>Total Video Feedback</h3>
            <p>{videoFeedbackCount}</p>
          </div>
          <div className="card text-feedback">
            <h3>Total Text Feedback</h3>
            <p>{textFeedbackCount}</p>
          </div>
        </div>
      </section>
      <section className="spaces">
        <h2>Spaces</h2>
        <Link to="/create-space">
          <button className="create-space">+ Create a new space</button>
        </Link>
        <div className="spaces-content">
          <div className="no-space">
            {loading ? (
              <p>Loading spaces...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : spaces.length === 0 ? (
              <>
              <img src={treeImg} alt="No space available" className="no-space-image"/>
              <p>No space yet, add a new one?</p>
              </>
            ) : (
              <div className="space-tiles">
                {spaces.map((space) => (
                  <div
                    className="space-tile"
                    key={space._id}
                    onClick={() => handleSpaceClick(space)}
                  >
                    <h3>{space.spacename}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Cookie Consent Bar */}
      {cookieConsent === null && (
        <div className="cookie-consent">
          <p>This website uses cookies to improve your experience. Do you accept the use of cookies?</p>
          <button onClick={handleAcceptCookies}>Accept</button>
          <button onClick={handleRejectCookies}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;