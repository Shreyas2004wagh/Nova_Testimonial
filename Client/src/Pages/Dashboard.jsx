import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import './Styles/Dashboard.css';
import happyGif from '../Images/happy.gif';
import palmGif from '../Images/palm.gif';
import angryGif from '../Images/angry.gif';
import cryingGif from '../Images/crying.gif';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in local storage');
        }

        const response = await fetch(`http://localhost:5000/getSpacesByUserId/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setSpaces(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleSpaceClick = (space) => {
    sessionStorage.setItem('selectedSpace', JSON.stringify(space));
    navigate('/space-details');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

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
            <h3>Video Feedback</h3>
            <p>0</p>
          </div>
          <div className="card text-feedback">
            <h3>Text Feedback</h3>
            <p>0</p>
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
              <p>No space yet, add a new one?</p>
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
    </div>
  );
};

export default Dashboard;
