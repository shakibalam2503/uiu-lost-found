import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Tag,
  Palette,
  Calendar,
  Building,
  Layers,
  FileText,
  Type,
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { useCreateLostItem } from "../hooks/useCreateLostItem";
import { useLostItemsContext } from "../lost-items.context";

const CATEGORIES = [
  "Electronics",
  "Books & Stationery",
  "Clothing & Accessories",
  "ID & Cards",
  "Keys",
  "Bags",
  "Jewelry",
  "Sports Equipment",
  "Other",
];

const COLORS = [
  "Black",
  "White",
  "Gray",
  "Brown",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
  "Pink",
  "Multicolor",
  "Other",
];

const BUILDINGS = [
  "Academic Building 1 (AB1)",
  "Academic Building 2 (AB2)",
  "Academic Building 3 (AB3)",
  "Library",
  "Student Center",
  "Cafeteria",
  "Sports Complex",
  "Administration Building",
  "Other",
];

const FLOORS = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor", "Rooftop"];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  color: "",
  lostDate: "",
  building: "",
  floor: "",
  locationDescription: "",
};

/**
 * LostItemForm — full report form for a lost item with validation and image upload
 * Props:
 *   onSuccess?: (item) => void
 */
export function LostItemForm({ onSuccess }) {
  const navigate = useNavigate();
  const { submitLostItem, loading, error: submitError, success } = useCreateLostItem();
  const { addItem } = useLostItemsContext();

  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (form.title.trim().length > 100) errors.title = "Title must be under 100 characters.";
    if (!form.category) errors.category = "Please select a category.";
    if (!form.lostDate) errors.lostDate = "Please specify the date you lost the item.";
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (form.lostDate && new Date(form.lostDate) > today) {
      errors.lostDate = "Lost date cannot be in the future.";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const item = await submitLostItem(form, imageFile);
      addItem(item);
      if (onSuccess) onSuccess(item);
      else navigate(`/lost-items/${item.id}`);
    } catch (_) {
      // error handled in hook
    }
  };

  if (success) {
    return (
      <div className="form-success-state">
        <div className="form-success-icon">
          <CheckCircle2 size={56} />
        </div>
        <h2>Item Reported!</h2>
        <p>Your lost item has been reported. We'll notify you if a match is found.</p>
        <div className="form-success-actions">
          <button className="btn-primary" onClick={() => navigate("/lost-items/my")}>
            View My Reports
          </button>
          <button className="btn-outline" onClick={() => navigate("/dashboard")}>
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="lost-item-form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="form-error-banner">
          <AlertCircle size={18} />
          <span>{submitError}</span>
        </div>
      )}

      {/* Image Upload */}
      <div className="form-section">
        <label className="form-section-label">
          <Tag size={16} /> Item Photo <span className="form-optional">(optional)</span>
        </label>
        <ImageUpload value={imageFile} onChange={setImageFile} disabled={loading} />
      </div>

      <div className="form-grid">
        {/* Title */}
        <div className={`form-group form-full ${validationErrors.title ? "has-error" : ""}`}>
          <label htmlFor="title" className="form-label">
            <Type size={15} /> Item Title <span className="form-required">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            placeholder="e.g. Blue Samsung Earphones"
            value={form.title}
            onChange={handleChange}
            disabled={loading}
            maxLength={100}
          />
          {validationErrors.title && <p className="form-error-msg">{validationErrors.title}</p>}
        </div>

        {/* Category */}
        <div className={`form-group ${validationErrors.category ? "has-error" : ""}`}>
          <label htmlFor="category" className="form-label">
            <Tag size={15} /> Category <span className="form-required">*</span>
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={form.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {validationErrors.category && <p className="form-error-msg">{validationErrors.category}</p>}
        </div>

        {/* Color */}
        <div className="form-group">
          <label htmlFor="color" className="form-label">
            <Palette size={15} /> Primary Color
          </label>
          <select
            id="color"
            name="color"
            className="form-select"
            value={form.color}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select color...</option>
            {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Lost Date */}
        <div className={`form-group ${validationErrors.lostDate ? "has-error" : ""}`}>
          <label htmlFor="lostDate" className="form-label">
            <Calendar size={15} /> Date Lost <span className="form-required">*</span>
          </label>
          <input
            id="lostDate"
            name="lostDate"
            type="date"
            className="form-input"
            value={form.lostDate}
            onChange={handleChange}
            disabled={loading}
            max={new Date().toISOString().split("T")[0]}
          />
          {validationErrors.lostDate && <p className="form-error-msg">{validationErrors.lostDate}</p>}
        </div>

        {/* Building */}
        <div className="form-group">
          <label htmlFor="building" className="form-label">
            <Building size={15} /> Building
          </label>
          <select
            id="building"
            name="building"
            className="form-select"
            value={form.building}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select building...</option>
            {BUILDINGS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Floor */}
        <div className="form-group">
          <label htmlFor="floor" className="form-label">
            <Layers size={15} /> Floor
          </label>
          <select
            id="floor"
            name="floor"
            className="form-select"
            value={form.floor}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select floor...</option>
            {FLOORS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Location Description */}
        <div className="form-group form-full">
          <label htmlFor="locationDescription" className="form-label">
            <MapPin size={15} /> Location Details
          </label>
          <input
            id="locationDescription"
            name="locationDescription"
            type="text"
            className="form-input"
            placeholder="e.g. Near the 2nd floor elevator, Room 301..."
            value={form.locationDescription}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div className="form-group form-full">
          <label htmlFor="description" className="form-label">
            <FileText size={15} /> Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            placeholder="Describe the item in detail — any unique marks, model, accessories, etc."
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            rows={4}
          />
        </div>
      </div>

      <div className="form-footer">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary btn-lg" disabled={loading}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Submitting...
            </span>
          ) : (
            <>
              Report Lost Item <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
