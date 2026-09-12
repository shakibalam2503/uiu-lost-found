import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  PlusCircle,
  Clock,
  MapPin,
  Laptop,
  CreditCard,
  Key,
  ArrowRight,
} from "lucide-react";
import Button from "../../../components/ui/button";
import Badge from "../../../components/ui/badge";
import useAuth from "../../auth/hooks/useAuth";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");

  const sampleItems = [
    {
      id: 1,
      title: "HP Spectre Laptop Charger",
      category: "electronics",
      location: "Library Floor 3 (Silent Area)",
      time: "25 mins ago",
      status: "Found",
      icon: Laptop,
    },
    {
      id: 2,
      title: "UIU Student ID Card (BSCSE)",
      category: "idcard",
      location: "Cafeteria Counter 2",
      time: "1 hour ago",
      status: "Found",
      icon: CreditCard,
    },
    {
      id: 3,
      title: "Silver Keychain & Bike Keys",
      category: "keys",
      location: "Basement Parking Gate 2",
      time: "2 hours ago",
      status: "Lost",
      icon: Key,
    },
  ];

  const filteredItems =
    activeCategory === "all"
      ? sampleItems
      : sampleItems.filter((item) => item.category === activeCategory);

  const handleAction = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section id="hero" className="hero-section bg-grid-pattern">
      <div className="hero-content">
        <div className="hero-left">
          <Badge variant="primary" className="hero-badge">
            <ShieldCheck size={14} style={{ color: "#ea580c" }} />
            <span>Official UIU Campus Recovery Portal</span>
          </Badge>

          <h1 className="hero-title">
            Lost Something at UIU? <br />
            <span className="text-gradient">Reconnect with Belongings.</span>
          </h1>

          <p className="hero-subtitle">
            The official centralized Lost & Found directory for{" "}
            <strong>United International University</strong>. Search item logs,
            submit reports, and retrieve lost items securely at official UIU
            campus desks.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleAction}
            >
              <PlusCircle size={20} />
              <span>Report Lost or Found Item</span>
              <ArrowRight size={18} />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleAction}
            >
              <Search size={18} />
              <span>Browse Campus Directory</span>
            </Button>
          </div>

          <div className="hero-stats-grid">
            <div className="stat-item">
              <span className="stat-number text-gradient-orange">98%</span>
              <span className="stat-label">Return Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">&lt; 24 Hours</span>
              <span className="stat-label">Desk Processing Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{ color: "#10b981" }}>100%</span>
              <span className="stat-label">Verified UIU Accounts</span>
            </div>
          </div>
        </div>

        {/* Hero Live Directory Preview */}
        <div className="hero-mockup-container">
          <div className="hero-mockup-card">
            <div className="mockup-header">
              <div className="mockup-dots">
                <div className="mockup-dot dot-red" />
                <div className="mockup-dot dot-yellow" />
                <div className="mockup-dot dot-green" />
              </div>
              <Badge variant="success" dot>
                Live Campus Feed
              </Badge>
            </div>

            <div className="mockup-search-box">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                readOnly
                value="Search by item name, location, or tag..."
                className="mockup-search-input"
              />
            </div>

            <div className="mockup-filter-chips">
              <button
                type="button"
                className={`filter-chip ${
                  activeCategory === "all" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All Logs
              </button>
              <button
                type="button"
                className={`filter-chip ${
                  activeCategory === "electronics" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("electronics")}
              >
                Electronics
              </button>
              <button
                type="button"
                className={`filter-chip ${
                  activeCategory === "idcard" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("idcard")}
              >
                ID Cards
              </button>
              <button
                type="button"
                className={`filter-chip ${
                  activeCategory === "keys" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("keys")}
              >
                Keys & Accessories
              </button>
            </div>

            <div className="mockup-items-list">
              {filteredItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="mockup-item-card">
                    <div className="mockup-item-img">
                      <ItemIcon size={22} />
                    </div>
                    <div className="mockup-item-info">
                      <div className="mockup-item-title">{item.title}</div>
                      <div className="mockup-item-meta">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {item.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {item.time}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={item.status === "Found" ? "success" : "warning"}
                    >
                      {item.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hero-floating-badge">
            <div className="ui-badge-dot" style={{ backgroundColor: "#ea580c" }} />
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                Verified Campus Desks
              </div>
              <div style={{ fontSize: "0.75rem", color: "#78716c" }}>
                UIU Library & Gate 1 Security
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
