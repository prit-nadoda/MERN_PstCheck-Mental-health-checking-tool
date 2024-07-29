import React, { useContext, useEffect, useState } from "react";
import "./ForgotPassword.css";
import { Context } from "../../main";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const { user, setActiveLink } = useContext(Context);
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/password/forgot",
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      toast.error("Failed to send password reset email.");
      console.error("API error:", error);
    }
  };

  useEffect(() => {
    setActiveLink("");
    console.log(user);
  }, [user, setActiveLink]);

  return (
    <section className="login">
      <div className="forget-container">
        <h2>Email Confirmation</h2>
        <p>We'll send a password reset URL to the email below</p>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleEmailChange}
            value={email}
            type="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit">Proceed</button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
