import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import "./NavBar.css";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ toggleSidebar }) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      setUser({});
      toast.success("Logged out successfully!");
      navigate("/sign-in");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="navbar">
      <div className="image-text">
        <i
          className="bx bx-menu-alt-left icon"
          id="menu-toggle"
          onClick={toggleSidebar}
        ></i>
        <span className="image">
          <img src={assets.long_logo} alt="Brand Logo" />
        </span>
      </div>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <button className="nav-logout" onClick={handleLogout}>
              <li className="nav-link">
                <a href="#">
                  <i className="bx bx-log-out icon"></i>
                  <span className="text nav-text">Logout</span>
                </a>
              </li>
            </button>
            <div className="nav-logout">
              <li className="nav-link">
                <Link to="/profile" className="nav-sign-in">
                  <i class="bx bx-user icon"></i>
                  <span className="text nav-text">Profile</span>
                </Link>
              </li>
            </div>
          </>
        ) : (
          <>
            <Link to="/sign-in" className="nav-sign-in">
              Sign In
            </Link>
            <Link to="/sign-up" className="nav-sign-up">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
