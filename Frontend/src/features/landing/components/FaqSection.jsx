import React from "react";
import { HelpCircle, ShieldCheck, Lock, MapPin, Mail, Search } from "lucide-react";
import Badge from "../../../components/ui/badge";
import { Accordion, AccordionItem } from "../../../components/ui/accordion";

export const FaqSection = () => {
  const faqs = [
    {
      icon: ShieldCheck,
      title: "Who can access and use this platform?",
      subtitle: "UIU Domain Account Requirement",
      content:
        "Only active students, faculty, and staff members of United International University with official Google Workspace accounts (`@bscse.uiu.ac.bd` or `@uiu.ac.bd`) can log in, report items, and submit claims. External accounts are blocked.",
    },
    {
      icon: Lock,
      title: "How is item ownership verified to prevent fake claims?",
      subtitle: "Secret Question & Proof System",
      content:
        "When an item is registered as found, key distinguishing details (such as serial numbers, lockscreen wallpaper, or pouch content) are kept confidential. Claimants must answer secret questions set by the finder or campus desk to verify ownership.",
    },
    {
      icon: MapPin,
      title: "Where are found physical items stored on campus?",
      subtitle: "Designated Campus Retrieval Desks",
      content:
        "Found physical items are deposited at official UIU custody desks: (1) UIU Library Circulation Desk, (2) Security Office at Gate 1 & Gate 2, or (3) Departmental Executive Offices.",
    },
    {
      icon: Search,
      title: "How do I find out if someone has turned in my lost item?",
      subtitle: "Search Directory & Status Tracking",
      content:
        "You can search the live campus directory by filtering item category, date, and campus location. When a matching entry is registered, you will also receive an instant status notification on your dashboard.",
    },
    {
      icon: Mail,
      title: "Will my personal phone number or student ID be visible publicly?",
      subtitle: "Privacy Protection",
      content:
        "No! Your personal contact number and private details remain hidden. All claim reviews and coordination occur securely within the platform without exposing your personal information on public boards.",
    },
  ];

  return (
    <section id="faq" className="landing-section faq-section">
      <div className="section-header">
        <Badge variant="info" className="section-tagline">
          <HelpCircle size={14} />
          <span>Help & Frequently Asked Questions</span>
        </Badge>
        <h2 className="section-title">Everything You Need To Know</h2>
        <p className="section-description">
          Have questions about account access, ownership verification, or item collection? Find answers below.
        </p>
      </div>

      <Accordion>
        {faqs.map((faq, idx) => (
          <AccordionItem
            key={idx}
            title={faq.title}
            subtitle={faq.subtitle}
            icon={faq.icon}
            defaultOpen={idx === 0}
          >
            {faq.content}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FaqSection;
