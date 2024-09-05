import React from 'react';
import './Styles/LandingPage.css';
import Designer from "../Images/Designer.png";
import { useNavigate } from 'react-router-dom';
import GoOn from '../Images/GoOnLogo.png';
import BingeLearn from '../Images/BingeLogo.png';
import GigX from '../Images/GigX.png';
import AnonymX from '../Images/AnonymXLogo.jpeg';


const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page">
      <header>
        <nav>
          <div className="logo">
            <img src={Designer} alt="Designer Logo" />
            <h1>Nova Testimonial</h1>
          </div>
          <div className="nav-buttons">
            <button className="login-btn" onClick={handleLoginClick}>Login</button>
            <button className="signup-btn" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="fade-in">Get testimonials from your customers with ease</h1>
          <p className="fade-in">Collecting testimonials is hard, we get it! So we built Testimonial.
            In minutes, you can collect text and video testimonials from your
            customers with no need for a developer or website hosting.
          </p>
          <button className="try-free-btn">Try FREE now</button>
          <a href="#" className="pricing-link">Check out our plans here →</a>
        </div>
      </section>

      <section className="trusted-customers-section">
        <h2 className="fade-in">Trusted by</h2>
        <div className="customer-logos">
          <img src={GoOn} alt="Happy" className="gif"/>
          <img src={BingeLearn} alt="Happy" className="gif"/>
          <img src={AnonymX} alt="Happy" className="gif"/>
          <img src={GigX} alt="Happy" className="gif"/>
        </div>
      </section>

      <section className="testimonial-section">
        <h2 className="fade-in">Add testimonials to your website with no coding!</h2>
        <p className="fade-in">
          Copy and paste our HTML code to add the Wall Of Love to your website.
          We support any no-code platform (Webflow, WordPress, you name it!).
        </p>
        <div className="testimonial-videos">
          <div className="testimonial fade-in">
            <video src="video1.mp4" controls></video>
            <p>Testimonial from Customer 1</p>
          </div>
          <div className="testimonial fade-in">
            <video src="video2.mp4" controls></video>
            <p>Testimonial from Customer 2</p>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2024 Your Testimonial Website. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
