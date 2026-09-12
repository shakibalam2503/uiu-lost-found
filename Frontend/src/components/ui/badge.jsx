import React from "react";

export const Badge = ({
  className = "",
  variant = "default", // default | outline | success | warning | info | primary
  dot = false,
  children,
  ...props
}) => {
  return (
    <span
      className={`ui-badge ui-badge-${variant} ${className}`}
      {...props}
    >
      {dot && <span className="ui-badge-dot" />}
      {children}
    </span>
  );
};

export default Badge;
