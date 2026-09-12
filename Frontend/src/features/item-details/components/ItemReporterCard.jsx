import React from "react";
import { UserCheck, ShieldCheck, Mail, User } from "lucide-react";

/**
 * Helper to mask emails safely so private addresses are not exposed publicly
 * Example: "shakib@bscse.uiu.ac.bd" => "s***b@bscse.uiu.ac.bd"
 */
function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return "Verified Contact";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * ItemReporterCard — Safe display of item reporter or registrar details without exposing private phone numbers or raw addresses
 * Props:
 *   name?: string
 *   email?: string
 *   role?: string
 *   itemType: "lost" | "found"
 */
export function ItemReporterCard({ name, email, role, itemType = "lost" }) {
  const isFound = itemType === "found";
  const displayName = name || (isFound ? "Campus Staff / Custodian" : "Verified UIU Student");
  const maskedEmailStr = maskEmail(email);

  return (
    <div className="item-reporter-card">
      <div className="reporter-avatar-wrapper">
        {name ? (
          <span className="avatar-initial">{name.charAt(0).toUpperCase()}</span>
        ) : (
          <User size={20} />
        )}
      </div>

      <div className="reporter-info-body">
        <div className="reporter-header-row">
          <span className="reporter-name">{displayName}</span>
          <span className="privacy-badge">
            <ShieldCheck size={13} style={{ color: "#ea580c" }} />
            <span>Verified UIU Account</span>
          </span>
        </div>

        <div className="reporter-contact-sub">
          <span className="reporter-email-masked">
            <Mail size={13} /> {maskedEmailStr}
          </span>
          <span className="bullet-sep">•</span>
          <span className="reporter-role-text">
            {role ? role.toUpperCase() : isFound ? "STAFF / ADMIN" : "STUDENT / FACULTY"}
          </span>
        </div>

        <p className="privacy-disclaimer">
          🔒 Private contact info is protected under UIU Lost & Found privacy policy. All verification and handover procedures are processed securely through campus custody desks.
        </p>
      </div>
    </div>
  );
}

export default ItemReporterCard;
