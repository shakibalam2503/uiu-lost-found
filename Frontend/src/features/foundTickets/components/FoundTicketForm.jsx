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
import { ImageUpload } from "../../lost-items/components/ImageUpload";
import { useCreateFoundTicket } from "../hooks/useCreateFoundTicket";

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
  foundDate: "",
  building: "",
  floor: "",
  locationDescription: "",
};

export function FoundTicketForm() {
  const navigate = useNavigate();
  const { submitTicket, loading, error: submitError } = useCreateFoundTicket();

  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (form.title.trim().length > 100) errors.title = "Title must be under 100 characters.";
    if (!form.category) errors.category = "Please select a category.";
    if (!form.foundDate) errors.foundDate = "Please specify the date you found the item.";
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (form.foundDate && new Date(form.foundDate) > today) {
      errors.foundDate = "Found date cannot be in the future.";
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

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await submitTicket(formData);
      setSuccess(true);
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
        <h2>Ticket Submitted!</h2>
        <p>Your after-hours found item ticket has been submitted to Lost & Found.</p>
        <div className="form-success-actions">
          <button className="btn-primary" onClick={() => navigate("/found-tickets/my")}>
            View My Tickets
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

        {/* Found Date */}
        <div className={`form-group ${validationErrors.foundDate ? "has-error" : ""}`}>
          <label htmlFor="foundDate" className="form-label">
            <Calendar size={15} /> Date Found <span className="form-required">*</span>
          </label>
          <input
            id="foundDate"
            name="foundDate"
            type="date"
            className="form-input"
            value={form.foundDate}
            onChange={handleChange}
            disabled={loading}
            max={new Date().toISOString().split("T")[0]}
          />
          {validationErrors.foundDate && <p className="form-error-msg">{validationErrors.foundDate}</p>}
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
            placeholder="Describe the item in detail..."
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
              Submit Ticket <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default FoundTicketForm;
