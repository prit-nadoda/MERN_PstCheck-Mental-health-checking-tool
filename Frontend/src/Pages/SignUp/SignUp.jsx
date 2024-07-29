import React, { useContext, useEffect, useState } from "react";
import "./SignUp.css";
import { assets } from "../../assets/assets";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const { setIsAuthenticated, setActiveLink } = useContext(Context);
  const [user, setUser] = useState({
    email: "",
    password: "",
    fullname: "",
    number: "",
  });
  const navigateTo = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, fullname, number } = user;
    console.log("Registering user:", user);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/patient/register",
        { email, password, fullname, number, type: "User" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("API response:", response);
      toast.success(response.data.message);
      setIsAuthenticated(true);
      console.log("isAuthenticated set to true");
      navigateTo("/");
    } catch (error) {
      console.log("API error:", error);
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      console.log("isAuthenticated set to false");
    }
  };

  useEffect(() => {
    setActiveLink("");
  }, [setActiveLink]);

  return (
    <section className="login">
      <div className="sign-up-container">
        <h2>Create an Account!</h2>
        <p>To get started, sign up with your details below.</p>
        <form onSubmit={handleRegister}>
          <input
            value={user.fullname}
            onChange={handleChange}
            name="fullname"
            type="text"
            placeholder="Full Name"
            required
          />
          <input
            value={user.email}
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
          <input
            value={user.number}
            onChange={handleChange}
            name="number"
            type="text"
            placeholder="Number"
            required
          />
          <input
            value={user.password}
            onChange={handleChange}
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="social-sign-up">
          <div className="separator">Or sign up with</div>
          <button className="with-google">
            <img src={assets.google_logo} alt="Google" />
            Sign up with Google
          </button>
          <button className="with-google">
            Already have an account? Sign Up
          </button>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
