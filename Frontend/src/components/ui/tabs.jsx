import React, { useState } from "react";

export const Tabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = "",
}) => {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : internalTab;

  const handleSelect = (id) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setInternalTab(id);
    }
  };

  return (
    <div className={`ui-tabs ${className}`}>
      <div className="ui-tabs-list">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`ui-tabs-trigger ${isActive ? "is-active" : ""}`}
              onClick={() => handleSelect(tab.id)}
            >
              {Icon && <Icon size={16} className="ui-tabs-icon" />}
              <span>{tab.label}</span>
              {tab.badge && <span className="ui-tabs-badge">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
