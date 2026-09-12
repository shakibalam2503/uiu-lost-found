import React from "react";
import {
  Search,
  ShieldCheck,
  Lock,
  Building2,
  Bell,
  CheckCircle2,
  Check,
} from "lucide-react";
import Badge from "../../../components/ui/badge";

export const SolutionSection = () => {
  const solutions = [
    {
      icon: Search,
      title: "Centralized Campus Directory",
      description:
        "Easily search and filter campus item logs by location, floor, category, and date to quickly find matches between lost and found reports.",
      highlights: [
        "Filter by campus area (Library, Cafeteria, Gates)",
        "Instant category & timestamp search",
        "Clear item status indicators",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Verified Institutional SSO",
      description:
        "Protected by official `@bscse.uiu.ac.bd` and `@uiu.ac.bd` Google authentication. Only verified campus members can submit or claim items.",
      highlights: [
        "Restricted to UIU email domain accounts",
        "Role verification (Student / Faculty / Staff)",
        "Blocks external unauthorized visitors",
      ],
    },
    {
      icon: Lock,
      title: "Secret Ownership Verification",
      description:
        "Found items require claimants to answer custom verification prompts (such as laptop serial no, lockscreen wallpaper, or pouch contents) before approval.",
      highlights: [
        "Custom owner-only verification questions",
        "Prevents false or accidental claims",
        "Secure claim approval workflow",
      ],
    },
    {
      icon: Building2,
      title: "Official Desk Handovers",
      description:
        "Direct integration with UIU Library Desk, Information Center, and Security Gates 1 & 2 for safe physical custody drop-off and pickup.",
      highlights: [
        "Physical custody logging at official desks",
        "Single-use pickup verification code",
        "Supervised handover by campus staff",
      ],
    },
    {
      icon: Bell,
      title: "Real-Time Log Notifications",
      description:
        "Receive instant notifications when an item matching your reported description or location is registered on campus.",
      highlights: [
        "In-app and email status notifications",
        "Direct claim progress updates",
        "Complete activity log history",
      ],
    },
    {
      icon: CheckCircle2,
      title: "Privacy-Preserving Claims",
      description:
        "Keep your personal phone number, home address, and social media handles completely private while managing item claims.",
      highlights: [
        "No public contact phone leakage",
        "Encrypted internal messaging bridge",
        "Compliant with campus privacy policy",
      ],
    },
  ];

  return (
    <section id="solution" className="landing-section solution-section">
      <div className="section-header">
        <Badge variant="primary" className="section-tagline">
          <ShieldCheck size={14} />
          <span>Purpose-Built for UIU Campus</span>
        </Badge>
        <h2 className="section-title">
          A Centralized, Safe & Organized <br />
          Item Recovery System
        </h2>
        <p className="section-description">
          Connecting students, faculty, and campus security staff through a single,
          secure network designed specifically for United International University.
        </p>
      </div>

      <div className="solution-grid">
        {solutions.map((sol, idx) => {
          const Icon = sol.icon;
          return (
            <div key={idx} className="solution-card">
              <div>
                <div className="solution-icon-box">
                  <Icon size={24} />
                </div>
                <h3 className="solution-title">{sol.title}</h3>
                <p className="solution-desc">{sol.description}</p>
              </div>

              <ul className="solution-highlights">
                {sol.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="solution-highlight-item">
                    <Check size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SolutionSection;
