import React from "react";

export const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  return (
    <div className={`spinner-container spinner-${size}`} role="status" aria-live="polite">
      <div className="spinner-ring"></div>
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
