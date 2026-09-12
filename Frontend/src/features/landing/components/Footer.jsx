import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  MapPin,
  Mail,
  PhoneCall,
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <ShieldCheck size={28} style={{ color: "#ea580c" }} />
              <span className="footer-brand-title">UIU Lost & Found</span>
            </Link>
            <p className="footer-desc">
              Official lost and found network for United International University.
              Connecting students, faculty, and campus security for safe item recovery.
            </p>
            <div className="status-pill">
              <span className="status-dot" />
              <span>Campus Portal Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li>
                <a href="#hero" className="footer-link">
                  Overview
                </a>
              </li>
              <li>
                <a href="#problem" className="footer-link">
                  Campus Issues
                </a>
              </li>
              <li>
                <a href="#solution" className="footer-link">
                  Our System
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="footer-link">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="footer-link">
                  FAQs & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Institutional Desks */}
          <div>
            <h4 className="footer-heading">Campus Desks</h4>
            <ul className="footer-links">
              <li>
                <span className="footer-link">UIU Main Library Desk</span>
              </li>
              <li>
                <span className="footer-link">Gate 1 Security Office</span>
              </li>
              <li>
                <span className="footer-link">Gate 2 Guard Post</span>
              </li>
              <li>
                <span className="footer-link">Cafeteria Info Counter</span>
              </li>
              <li>
                <span className="footer-link">Student Affairs Office</span>
              </li>
            </ul>
          </div>

          {/* Campus Location & Support */}
          <div>
            <h4 className="footer-heading">University Info</h4>
            <div className="footer-contact-info">
              <div className="contact-row">
                <MapPin size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>
                  United City, Madani Avenue, Badda, Dhaka 1212, Bangladesh
                </span>
              </div>
              <div className="contact-row">
                <Mail size={18} style={{ flexShrink: 0 }} />
                <span>support@lostandfound.uiu.ac.bd</span>
              </div>
              <div className="contact-row">
                <PhoneCall size={18} style={{ flexShrink: 0 }} />
                <span>UIU Hotline: +880 9604-848848</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} United International University Lost & Found Portal.
            All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link">Terms of Service</span>
            <span className="footer-link">Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
