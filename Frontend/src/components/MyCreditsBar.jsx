import React from "react";
import PropTypes from "prop-types";

const MyCreditsBar = ({ max, current }) => {
  const percentage = (current / max) * 100;

  const progressBarStyle = {
    height: "8px", // Adjust height for a thin progress bar
    width: "100%",
    backgroundColor: "#cfcfcf",
    borderRadius: "4px", // Rounded corners
    overflow: "hidden",
  };

  const progressStyle = {
    height: "100%",
    width: `${percentage}%`,
    backgroundColor: "var(--primary-color)",
    borderRadius: "4px", // Ensures rounded corners even on small progress values
  };

  return (
    <div style={progressBarStyle}>
      <div style={progressStyle}></div>
    </div>
  );
};

MyCreditsBar.propTypes = {
  max: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
};

export default MyCreditsBar;
