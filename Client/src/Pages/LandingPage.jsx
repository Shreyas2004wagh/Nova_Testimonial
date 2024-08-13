import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <Link to="/login">
        <button>
          Navigate to login
        </button>
      </Link>
    </div>
  );
};

export default LandingPage;
