import React from "react";
import {
  MapPin,
  Clock,
  Tag,
  Palette,
  ArrowRight,
  User,
  Laptop,
  CreditCard,
  Key,
  BookOpen,
  ShoppingBag,
  Layers,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";

export const ItemCard = ({ item, onClick }) => {
  const {
    id,
    title,
    description,
    category,
    color,
    building,
    floor,
    locationDescription,
    type = "lost",
    status = "lost",
    imageUrls = [],
    reporterName,
    reporterEmail,
    createdAt,
    lostDate,
    foundDate,
  } = item;

  // Format date cleanly
  const displayDate = lostDate || foundDate || createdAt;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  // Category Icon Resolver
  const getCategoryIcon = () => {
    switch (category?.toLowerCase()) {
      case "electronics":
        return Laptop;
      case "idcard":
        return CreditCard;
      case "keys":
        return Key;
      case "book":
        return BookOpen;
      case "bag":
      case "clothing":
      case "wallet":
      case "accessories":
        return ShoppingBag;
      default:
        return Tag;
    }
  };

  const CategoryIcon = getCategoryIcon();
  const hasImage = imageUrls && imageUrls.length > 0 && imageUrls[0];

  return (
    <Card className="feed-item-card" hoverEffect onClick={onClick}>
      {/* Card Media Section */}
      <div className="card-media-wrapper">
        {hasImage ? (
          <img src={imageUrls[0]} alt={title} className="card-media-img" />
        ) : (
          <div className={`card-media-fallback category-fallback-${category || "default"}`}>
            <CategoryIcon size={40} className="fallback-icon" />
            <span className="fallback-category-text">{category || "Item"}</span>
          </div>
        )}
        <div className="card-status-overlay">
          <StatusBadge type={type} status={status} />
        </div>
      </div>

      <CardHeader className="card-header-compact">
        {/* Title */}
        <CardTitle className="card-item-title">{title}</CardTitle>
      </CardHeader>

      <CardContent className="card-content-compact">
        {/* Short Description */}
        <p className="card-item-desc">
          {description && description.length > 110
            ? `${description.substring(0, 110)}...`
            : description || "No detailed description provided."}
        </p>

        {/* Location & Floor info */}
        <div className="card-meta-grid">
          <div className="meta-pill">
            <MapPin size={13} className="meta-icon" />
            <span>{building || "Campus Area"} {floor ? `• Fl ${floor}` : ""}</span>
          </div>

          <div className="meta-pill">
            <Clock size={13} className="meta-icon" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Category & Color row */}
        <div className="card-attributes-row">
          <span className="attribute-badge">
            <CategoryIcon size={12} />
            <span style={{ textTransform: "capitalize" }}>{category || "General"}</span>
          </span>

          {color && (
            <span className="attribute-badge color-attribute">
              <span
                className="color-dot"
                style={{ backgroundColor: color.toLowerCase() }}
              />
              <span style={{ textTransform: "capitalize" }}>{color}</span>
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer with Reporter info and View Details action */}
      <CardFooter className="card-footer-compact">
        <div className="card-reporter-info">
          <div className="reporter-avatar">
            {reporterName ? reporterName.charAt(0).toUpperCase() : <User size={14} />}
          </div>
          <div className="reporter-text">
            <span className="reporter-name">{reporterName || "Campus Member"}</span>
            <span className="reporter-sub">{type === "found" ? "Finder Log" : "Owner Log"}</span>
          </div>
        </div>

        <button type="button" className="btn-view-details">
          <span>View Details</span>
          <ArrowRight size={14} />
        </button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
