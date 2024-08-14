import React from 'react';
import '../Components/Loader.css'; // The CSS file

const TypewriterLoader = () => {
  return (
    <div className="loader-container">
      <div className="typewriter">
        <div className="slide"><i></i></div>
        <div className="paper"></div>
        <div className="keyboard"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default TypewriterLoader;
