import { Link, useNavigate } from 'react-router-dom';
import './Styles/LandingPage.css';
import Designer from "../Images/Designer.png";
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
          <p className="fade-in">Collecting testimonials is hard, we get it. Nova helps you collect text and video testimonials
            in minutes, with no need for a developer or website hosting.
          </p>
          <button className="try-free-btn" onClick={handleSignUpClick}>Try FREE now</button>
          <Link to="/signup" className="pricing-link">Create your first testimonial space -&gt;</Link>
        </div>
      </section>

      <section className="trusted-customers-section">
        <h2 className="fade-in">Trusted by</h2>
        <div className="customer-logos">
          <img src={GoOn} alt="GoOn logo" className="gif" />
          <img src={BingeLearn} alt="BingeLearn logo" className="gif" />
          <img src={AnonymX} alt="AnonymX logo" className="gif" />
          <img src={GigX} alt="GigX logo" className="gif" />
        </div>
      </section>

      <section className="testimonial-section">
        <h2 className="fade-in">Add testimonials to your website with no coding!</h2>
        <p className="fade-in">
          Copy and paste our HTML code to add the Wall Of Love to your website.
          We support any no-code platform (Webflow, WordPress, you name it!).
        </p>
        <div className="testimonial-cards">
          <div className="testimonial fade-in">
            <p className="quote">&quot;Nova made it easy to collect useful customer stories right after each launch.&quot;</p>
            <p className="customer">Product Founder</p>
          </div>
          <div className="testimonial fade-in">
            <p className="quote">&quot;We shared one link and had organized feedback ready in the dashboard.&quot;</p>
            <p className="customer">Growth Lead</p>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2026 Nova Testimonial. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
