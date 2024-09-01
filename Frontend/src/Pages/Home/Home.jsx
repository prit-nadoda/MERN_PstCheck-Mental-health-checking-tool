import React from 'react';
import './Home.css';
import { assets } from '../../assets/assets.js';

function Home() {
  return (
    <div className="container">
      <div className="custom-grid"></div>
      <div className="heading-container">
        <h1 className="heading">
          Psy<span>Check</span>
        </h1>
        <p className="subheading">Mental health checking tool</p>
      </div>
      <div className="dashboard-image custom-shadow">
        <img src={assets.user_dashboard} alt="Dashboard" className="custom-image" />
      </div>
    </div>
  );
}

export default Home;
