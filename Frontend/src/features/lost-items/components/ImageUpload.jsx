import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

/**
 * ImageUpload component — drag & drop or click to select an image file
 * Props:
 *   value: File | null
 *   onChange: (File | null) => void
 *   disabled?: boolean
 */
export function ImageUpload({ value, onChange, disabled = false }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const preview = value ? URL.createObjectURL(value) : null;

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10 MB.");
      return;
    }
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="image-upload-wrapper">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        style={{ display: "none" }}
        id="image-upload-input"
      />

      {preview ? (
        <div className="image-upload-preview">
          <img src={preview} alt="Preview" className="image-upload-img" />
          {!disabled && (
            <button
              type="button"
              className="image-upload-remove"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          )}
          <div className="image-upload-overlay">
            <span onClick={() => !disabled && inputRef.current?.click()}>
              Change Image
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`image-upload-drop-zone ${dragOver ? "drag-over" : ""} ${disabled ? "disabled" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
          aria-label="Upload image"
        >
          <div className="image-upload-icon">
            {dragOver ? <Upload size={32} /> : <ImageIcon size={32} />}
          </div>
          <p className="image-upload-text">
            {dragOver ? "Drop to upload" : "Drag & drop or click to upload"}
          </p>
          <p className="image-upload-hint">PNG, JPG, WEBP up to 10 MB</p>
        </div>
      )}
    </div>
  );
}
