import React from "react";
import {
  FilePlus2,
  Search,
  ShieldAlert,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import Badge from "../../../components/ui/badge";

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: FilePlus2,
      title: "Submit a Report",
      description:
        "Log in with your `@uiu.ac.bd` email and post a lost or found item report with location tags, date, category, and description in under a minute.",
    },
    {
      number: "02",
      icon: Search,
      title: "Search & Filter Logs",
      description:
        "Browse the centralized campus directory by area (Library, Cafeteria, Security Gate) to match reported lost entries with turned-in items.",
    },
    {
      number: "03",
      icon: ShieldAlert,
      title: "Verify Ownership",
      description:
        "Answer hidden verification prompts (such as serial numbers, lockscreen wallpaper, or unique item marks) set by the finder or campus desk.",
    },
    {
      number: "04",
      icon: QrCode,
      title: "Collect at Campus Desk",
      description:
        "Once approved, pick up your item at the UIU Library Info Desk or Security Office using a single-use verification code.",
    },
  ];

  return (
    <section id="how-it-works" className="landing-section how-it-works-section">
      <div className="section-header">
        <Badge variant="success" className="section-tagline">
          <CheckCircle2 size={14} />
          <span>Simple 4-Step Process</span>
        </Badge>
        <h2 className="section-title">
          How Our Platform Works <br />
          From Report to Safe Handover
        </h2>
        <p className="section-description">
          A clear, structured workflow connecting students, faculty, and campus security
          for fast and reliable item returns.
        </p>
      </div>

      <div className="steps-container">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="step-card">
              <div className="step-number-badge">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorksSection;
