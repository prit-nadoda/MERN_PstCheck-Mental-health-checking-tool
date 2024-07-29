import React from "react";
import "./Home.css";
import { assets } from "../../assets/assets";

const HomePage = () => {
  return (
    <section className="home">
      <p className="greeting">Hey there!</p>
      <div className="text">
        Welcome to <span style={{ color: "#fcb01e" }}>Psy</span>
        <span style={{ color: "#3467da" }}>Check</span>, <br /> a mental health
        checking tool
      </div>
      <img className="hero-image" src={assets.home_image} alt="" />
      <div className="cards">
        <div className="card">
          <h3>100k+</h3>
          <p>
            active users <br />
            monthly
          </p>
        </div>
        <div className="card">
          <h3>5+</h3>
          <p>
            mental conditions <br />
            assistance.
          </p>
        </div>
        <div className="card">
          <h3>AI</h3>
          <p>
            virtual health <br />
            assistant
          </p>
        </div>
        <div className="card">
          <h3>15</h3>
          <p>
            questions health <br />
            assesment
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
