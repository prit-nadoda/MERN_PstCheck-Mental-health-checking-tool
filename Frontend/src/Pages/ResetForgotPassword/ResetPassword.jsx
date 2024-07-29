import React, { useState } from "react";
import "./ResetForgotPassword.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/user/password/reset/${token}`,
        { password, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Password reset successfully!");
      navigate("/sign-in");
    } catch (error) {
      toast.error(error.response.data.message || "Failed to reset password");
    }
  };

  return (
    <section className="login">
      <div className="forget-reset-container">
        <h2>Reset Password!</h2>
        <p>Your password will be reset to the one you enter below</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          <button type="submit">Reset</button>
        </form>
      </div>
    </section>
  );
};

export default ResetForgotPassword;
