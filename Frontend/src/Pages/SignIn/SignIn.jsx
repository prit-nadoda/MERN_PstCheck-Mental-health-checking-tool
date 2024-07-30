import React, { useContext, useState } from "react";
import "./SignIn.css";
import { assets } from "../../assets/assets";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SignIn = () => {
  const { setIsAuthenticated, setActiveLink, setUser } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGoogleLogin = async () => {
    window.open(`http://localhost:4000/api/v1/user/auth/google`, "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, type: "User" },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Login successful!");
      setIsAuthenticated(true);
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message || "Login failed");
      setIsAuthenticated(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <section className="login">
      <div className="login-container">
        <h2>Welcome Back!</h2>
        <p>To get started, sign in to your account.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <a href="#" onClick={handleForgotPassword}>
            Forgot password?
          </a>
          <button type="submit">Sign in</button>
        </form>
        <div className="social-login">
          <div className="separator">Or sign in with</div>
          <button onClick={handleGoogleLogin} className="with-google">
            <img src={assets.google_logo} alt="Google" />
            Sign in with Google
          </button>
          <Link to={"/sign-up"}>
            <button className="with-google">
              Don't have an account? Sign Up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
