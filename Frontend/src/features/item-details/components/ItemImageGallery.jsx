import React, { useState, useEffect } from "react";
import { ImageOff, Image as ImageIcon } from "lucide-react";

/**
 * ItemImageGallery — Renders large primary image with thumbnail navigation and fallback for load errors
 * Props:
 *   imageUrls: string[]
 *   title: string
 *   statusBadge?: React.ReactNode
 */
export function ItemImageGallery({ imageUrls = [], title = "Item Image", statusBadge = null }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  // Reset selected index if imageUrls change
  useEffect(() => {
    setSelectedIndex(0);
    setFailedImages({});
  }, [imageUrls]);

  const currentUrl = imageUrls[selectedIndex] || null;
  const isCurrentFailed = !currentUrl || failedImages[selectedIndex];

  const handleImageError = (index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="item-details-gallery">
      {/* Main Image Stage */}
      <div className="item-gallery-main-stage">
        {!isCurrentFailed ? (
          <img
            src={currentUrl}
            alt={`${title} - View ${selectedIndex + 1}`}
            className="item-gallery-large-img"
            onError={() => handleImageError(selectedIndex)}
            loading="eager"
          />
        ) : (
          <div className="item-gallery-fallback-card">
            <ImageOff size={56} className="fallback-icon" />
            <span className="fallback-title">Image Unavailable</span>
            <span className="fallback-subtitle">
              Photo failed to load or no image was attached to this report.
            </span>
          </div>
        )}

        {statusBadge && <div className="item-gallery-badge-wrapper">{statusBadge}</div>}
      </div>

      {/* Thumbnail Selector (if multiple images exist) */}
      {imageUrls.length > 1 && (
        <div className="item-gallery-thumbnails-strip">
          {imageUrls.map((url, idx) => {
            const isThumbFailed = failedImages[idx];
            return (
              <button
                key={idx}
                type="button"
                className={`item-gallery-thumb-btn ${selectedIndex === idx ? "active" : ""}`}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                {!isThumbFailed && url ? (
                  <img
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    onError={() => handleImageError(idx)}
                  />
                ) : (
                  <div className="thumb-fallback">
                    <ImageIcon size={18} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ItemImageGallery;
