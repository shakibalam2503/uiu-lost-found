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
import { useCreateFoundItem } from "../hooks/useCreateFoundItem";
import { useFoundItemsContext } from "../found-items.context";

const CATEGORIES = [
  "Electronics", "Books & Stationery", "Clothing & Accessories",
  "ID & Cards", "Keys", "Bags", "Jewelry", "Sports Equipment", "Other",
];

const COLORS = [
  "Black", "White", "Gray", "Brown", "Red", "Orange", "Yellow",
  "Green", "Blue", "Purple", "Pink", "Multicolor", "Other",
];

const BUILDINGS = [
  "Academic Building 1 (AB1)", "Academic Building 2 (AB2)",
  "Academic Building 3 (AB3)", "Library", "Student Center",
  "Cafeteria", "Sports Complex", "Administration Building", "Other",
];

const FLOORS = [
  "Ground Floor", "1st Floor", "2nd Floor", "3rd Floor",
  "4th Floor", "5th Floor", "Rooftop",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  color: "",
  foundDate: "",
  building: "",
  floor: "",
  locationDescription: "",
};

/**
 * FoundItemForm — form for staff/admin to register a found item
 * Props:
 *   onSuccess?: (item) => void
 *   initialValues?: object (for edit mode)
 *   submitLabel?: string
 */
export function FoundItemForm({ onSuccess, initialValues, submitLabel = "Register Found Item" }) {
  const navigate = useNavigate();
  const { submitFoundItem, loading, error: submitError, success } = useCreateFoundItem();
  const { addItem } = useFoundItemsContext();

  const [form, setForm] = useState({ ...INITIAL_FORM, ...initialValues });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (form.title.trim().length > 100) e.title = "Title must be under 100 characters.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.foundDate) e.foundDate = "Please specify when it was found.";
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (form.foundDate && new Date(form.foundDate) > today)
      e.foundDate = "Found date cannot be in the future.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      const item = await submitFoundItem(form, imageFile);
      addItem(item);
      if (onSuccess) onSuccess(item);
      else navigate(`/found-items/${item.id}`);
    } catch (_) { /* handled in hook */ }
  };

  if (success) {
    return (
      <div className="form-success-state">
        <div className="form-success-icon">
          <CheckCircle2 size={56} />
        </div>
        <h2>Found Item Registered!</h2>
        <p>The item has been added to the found items registry.</p>
        <div className="form-success-actions">
          <button className="btn-primary" onClick={() => navigate("/found-items")}>
            View Found Items
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

      {/* Image */}
      <div className="form-section">
        <label className="form-section-label">
          <Tag size={16} /> Item Photo <span className="form-optional">(optional)</span>
        </label>
        <ImageUpload value={imageFile} onChange={setImageFile} disabled={loading} />
      </div>

      <div className="form-grid">
        {/* Title */}
        <div className={`form-group form-full ${errors.title ? "has-error" : ""}`}>
          <label htmlFor="fi-title" className="form-label">
            <Type size={15} /> Item Title <span className="form-required">*</span>
          </label>
          <input id="fi-title" name="title" type="text" className="form-input"
            placeholder="e.g. Black Leather Wallet" value={form.title}
            onChange={handleChange} disabled={loading} maxLength={100} />
          {errors.title && <p className="form-error-msg">{errors.title}</p>}
        </div>

        {/* Category */}
        <div className={`form-group ${errors.category ? "has-error" : ""}`}>
          <label htmlFor="fi-category" className="form-label">
            <Tag size={15} /> Category <span className="form-required">*</span>
          </label>
          <select id="fi-category" name="category" className="form-select"
            value={form.category} onChange={handleChange} disabled={loading}>
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="form-error-msg">{errors.category}</p>}
        </div>

        {/* Color */}
        <div className="form-group">
          <label htmlFor="fi-color" className="form-label">
            <Palette size={15} /> Primary Color
          </label>
          <select id="fi-color" name="color" className="form-select"
            value={form.color} onChange={handleChange} disabled={loading}>
            <option value="">Select color...</option>
            {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Found Date */}
        <div className={`form-group ${errors.foundDate ? "has-error" : ""}`}>
          <label htmlFor="fi-foundDate" className="form-label">
            <Calendar size={15} /> Date Found <span className="form-required">*</span>
          </label>
          <input id="fi-foundDate" name="foundDate" type="date" className="form-input"
            value={form.foundDate} onChange={handleChange} disabled={loading}
            max={new Date().toISOString().split("T")[0]} />
          {errors.foundDate && <p className="form-error-msg">{errors.foundDate}</p>}
        </div>

        {/* Building */}
        <div className="form-group">
          <label htmlFor="fi-building" className="form-label">
            <Building size={15} /> Building
          </label>
          <select id="fi-building" name="building" className="form-select"
            value={form.building} onChange={handleChange} disabled={loading}>
            <option value="">Select building...</option>
            {BUILDINGS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Floor */}
        <div className="form-group">
          <label htmlFor="fi-floor" className="form-label">
            <Layers size={15} /> Floor
          </label>
          <select id="fi-floor" name="floor" className="form-select"
            value={form.floor} onChange={handleChange} disabled={loading}>
            <option value="">Select floor...</option>
            {FLOORS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Location Description */}
        <div className="form-group form-full">
          <label htmlFor="fi-loc" className="form-label">
            <MapPin size={15} /> Location Details
          </label>
          <input id="fi-loc" name="locationDescription" type="text" className="form-input"
            placeholder="e.g. Left at the security desk, Room 204..."
            value={form.locationDescription} onChange={handleChange} disabled={loading} />
        </div>

        {/* Description */}
        <div className="form-group form-full">
          <label htmlFor="fi-desc" className="form-label">
            <FileText size={15} /> Description
          </label>
          <textarea id="fi-desc" name="description" className="form-textarea" rows={4}
            placeholder="Describe the item — condition, marks, model, accessories..."
            value={form.description} onChange={handleChange} disabled={loading} />
        </div>
      </div>

      <div className="form-footer">
        <button type="button" className="btn-ghost" onClick={() => navigate(-1)} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-success btn-lg" disabled={loading}>
          {loading ? (
            <span className="btn-loading"><span className="spinner" />Submitting...</span>
          ) : (
            <><CheckCircle2 size={18} /> {submitLabel}</>
          )}
        </button>
      </div>
    </form>
  );
}
