import React, { useContext } from "react";
import "./SideBar.css";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { TbUserPlus } from "react-icons/tb";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
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

  const textStyle = {
    height: "20px",
  };

  return (
    <nav className={`sidebar ${isOpen ? "" : "close"}`}>
      <header>
        <i className="bx bx-chevron-right toggle" onClick={toggleSidebar}></i>
      </header>
      <div className="menu-bar">
        <div className="menu">
          <li className="search-box">
            <i className="bx bx-search icon"></i>
            <input type="text" placeholder="Search..." />
          </li>
          <ul className="menu-links">
            <li className="nav-link">
              <a href="#">
                <i className="bx bx-home-alt icon"></i>
                <span className="text nav-text">Dashboard</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className="bx bx-bar-chart-alt-2 icon"></i>
                <span className="text nav-text">Revenue</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className="bx bx-bell icon"></i>
                <span className="text nav-text">Notifications</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className="bx bx-pie-chart-alt icon"></i>
                <span className="text nav-text">Analytics</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className="bx bx-heart icon"></i>
                <span className="text nav-text">Likes</span>
              </a>
            </li>
            <li className="nav-link">
              <a href="#">
                <i className="bx bx-wallet icon"></i>
                <span className="text nav-text">Wallets</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="bottom-content">
          {isAuthenticated ? (
            <>
              <li onClick={handleLogout} className="">
                <a href="#">
                  <i className="bx bx-log-out icon"></i>
                  <span className="text nav-text">Logout</span>
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/sign-in" className="side-sign-in">
                  <i className="bx bx-log-in icon"></i>
                  <span className="text nav-text">Sign In</span>
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="side-sign-in">
                  <TbUserPlus style={textStyle} className="icon" />
                  <span className="text nav-text">Sign Up</span>
                </Link>
              </li>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SideBar;
