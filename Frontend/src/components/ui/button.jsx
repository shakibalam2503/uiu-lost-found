import React from "react";

export const Button = React.forwardRef(
  (
    {
      className = "",
      variant = "default", // default | primary | outline | ghost | secondary | gradient | danger
      size = "md", // sm | md | lg | icon
      children,
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyle = "ui-button";
    const variantClass = `ui-button-${variant}`;
    const sizeClass = `ui-button-${size}`;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyle} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
