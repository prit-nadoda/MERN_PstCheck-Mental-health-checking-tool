import React from "react";
import "./Footer.css";
import { FaInstagram, FaTiktok, FaLinkedin, FaTwitter, FaPinterest } from "react-icons/fa";
import { assets } from "../../assets/assets";


const Footer = () => {
  return (
    <footer className="footer-component">
      <div className="footer-component-container">
        <article className="footer-component-article">
          <h2>Get your health report now</h2>
          <button>
            <p>Sign up for free</p>
          </button>
        </article>
        <section className="footer-component-section">
          <img src={assets.logo_full} alt="Logo" />
          <div className="footer-component-socials">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTiktok /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaPinterest /></a>
          </div>
          <ul>
            <li>
              <h3>Resources</h3>
              <a href="#">Usage</a>
              <a href="#">Docs</a>
              <a href="#">Support</a>
              <a href="#">Hardware</a>
            </li>
            <li>
              <h3>Developers</h3>
              <a href="#">Forum</a>
              <a href="#">Projects</a>
              <a href="#">Source</a>
              <a href="#">GitHub</a>
            </li>
            <li>
              <h3>Pricing</h3>
              <a href="#">Plans</a>
              <a href="#">Data</a>
              <a href="#">Volume</a>
              <a href="#">Clients</a>
            </li>
            <li>
              <h3>Company</h3>
              <a href="#">About</a>
              <a href="#">Brand</a>
              <a href="#">Partners</a>
              <a href="#">Careers</a>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
