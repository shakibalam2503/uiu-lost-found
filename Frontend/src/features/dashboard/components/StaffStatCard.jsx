import React from "react";

export const StaffStatCard = ({ title, value, icon: Icon, color = "orange", subtitle }) => {
  const getColorClasses = (c) => {
    switch (c) {
      case "amber":
        return { bg: "#fef3c7", text: "#d97706", border: "#fde68a" };
      case "green":
        return { bg: "#d1fae5", text: "#059669", border: "#a7f3d0" };
      case "blue":
        return { bg: "#dbeafe", text: "#2563eb", border: "#bfdbfe" };
      case "purple":
        return { bg: "#f3e8ff", text: "#7c3aed", border: "#e9d5ff" };
      case "orange":
      default:
        return { bg: "#ffedd5", text: "#ea580c", border: "#fed7aa" };
    }
  };

  const theme = getColorClasses(color);

  return (
    <div className="staff-stat-card" style={{ borderColor: theme.border }}>
      <div className="staff-stat-header">
        <span className="staff-stat-title">{title}</span>
        <div
          className="staff-stat-icon-wrapper"
          style={{ backgroundColor: theme.bg, color: theme.text }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="staff-stat-body">
        <div className="staff-stat-value" style={{ color: theme.text }}>
          {value}
        </div>
        {subtitle && <div className="staff-stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StaffStatCard;
