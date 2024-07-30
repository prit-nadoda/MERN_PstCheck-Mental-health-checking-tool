import React from "react";
import "./VerifyEmail.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigateTo = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get(
        `http://localhost:4000/api/v1/user/verify-email/${token}`
      );
      toast.success("Email verified successfully!");
      navigateTo("/");
    } catch (error) {
      toast.error("Failed to verify email. Please try again.");
    }
  };

  return (
    <section className="verify-email">
      <div className="verify-email-container">
        <h2>Verify Your Email</h2>
        <p>
          Click the button below to mark yourself and your email as verified to
          access more privileges, such as the forgot password feature.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea value={token} readOnly />
          <button type="submit">Verify Now</button>
        </form>
        <div className="verify-email-info">
          Clicking the button above will verify your email.
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
