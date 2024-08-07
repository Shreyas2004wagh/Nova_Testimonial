import React from 'react';
import './Styles/Dashboard.css';
import happyGif from '../Images/happy.gif';
import palmGif from '../Images/palm.gif';
import angryGif from '../Images/angry.gif';
import cryingGif from '../Images/crying.gif';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">
          <h1>Nova</h1>
        </div>
        <div className="nav-links">
          <button className="login">Login</button>
          <button className="signup">Signup</button>
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
        <div className="spaces-content">
          <div className="no-space">
            <p>No space yet, add a new one?</p>
          </div>
          <button className="create-space">+ Create a new space</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
