import React from "react";
import {
  MessageSquareOff,
  UserX,
  EyeOff,
  FileQuestion,
  AlertTriangle,
} from "lucide-react";
import Badge from "../../../components/ui/badge";

export const ProblemSection = () => {
  const problems = [
    {
      icon: MessageSquareOff,
      title: "Disorganized Social & Group Posts",
      description:
        "Lost item posts quickly get buried under hundreds of daily messages in student Facebook groups and Messenger chats, making them impossible to trace after a few hours.",
    },
    {
      icon: UserX,
      title: "Unverified & Imposter Claims",
      description:
        "Valuable items like laptops, smartphones, and earphone cases often face unauthorized claim attempts when photos and details are broadcast publicly.",
    },
    {
      icon: EyeOff,
      title: "Public Exposure of Personal Details",
      description:
        "Students frequently post their personal phone numbers, student ID numbers, and social profiles publicly, exposing themselves to spam and privacy risks.",
    },
    {
      icon: FileQuestion,
      title: "Uncoordinated Campus Information",
      description:
        "Items turned in at the Library, Cafeteria, or Security Gate remain stored across separate campus desks without a unified, real-time registry.",
    },
  ];

  return (
    <section id="problem" className="landing-section problem-section">
      <div className="section-header">
        <Badge variant="warning" className="section-tagline">
          <AlertTriangle size={14} />
          <span>The Campus Challenge</span>
        </Badge>
        <h2 className="section-title">
          Why Unofficial Group Posts & Chat Groups <br />
          Fall Short for Lost Items
        </h2>
        <p className="section-description">
          Relying on scattered social feeds creates communication noise, exposes student contact details,
          and delays the return of valuable belongings.
        </p>
      </div>

      <div className="problem-grid">
        {problems.map((prob, idx) => {
          const Icon = prob.icon;
          return (
            <div key={idx} className="problem-card">
              <div className="problem-icon-wrapper">
                <Icon size={22} />
              </div>
              <h3 className="problem-title">{prob.title}</h3>
              <p className="problem-desc">{prob.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProblemSection;
