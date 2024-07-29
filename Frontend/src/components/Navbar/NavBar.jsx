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
            <button onClick={handleLogout}>Logout</button>
            <img
              src={assets.profile_icon} // Replace with the actual path to the profile icon
              alt="Profile"
              className="profile-icon"
            />
          </>
        ) : (
          <>
            <Link to="/sign-in" className="nav-sign-in">
              Login
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
