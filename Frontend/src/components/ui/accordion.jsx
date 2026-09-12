import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Accordion = ({ children, className = "" }) => {
  return <div className={`ui-accordion ${className}`}>{children}</div>;
};

export const AccordionItem = ({
  title,
  subtitle,
  children,
  defaultOpen = false,
  icon: Icon,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`ui-accordion-item ${isOpen ? "is-open" : ""} ${className}`}>
      <button
        type="button"
        className="ui-accordion-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="ui-accordion-header-content">
          {Icon && (
            <div className="ui-accordion-icon-box">
              <Icon size={18} />
            </div>
          )}
          <div>
            <h4 className="ui-accordion-title">{title}</h4>
            {subtitle && <p className="ui-accordion-subtitle">{subtitle}</p>}
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`ui-accordion-chevron ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="ui-accordion-content">
          <div className="ui-accordion-body">{children}</div>
        </div>
      )}
    </div>
  );
};
