import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Edit3 } from "lucide-react";
import { FoundItemForm } from "../components/FoundItemForm";
import { getFoundItemById, updateFoundItem } from "../services/found-item.service";
import { useFoundItemsContext } from "../found-items.context";
import { AuthContext } from "../../auth/auth.context";
import LoadingSpinner from "../../../components/LoadingSpinner";

/**
 * RegisterFoundItemPage — page for Staff and Admin to register a new found item or edit an existing one
 */
export function RegisterFoundItemPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useContext(AuthContext);
  const { replaceItem } = useFoundItemsContext();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;
    let mounted = true;
    async function loadItem() {
      try {
        setLoading(true);
        const data = await getFoundItemById(id);
        if (mounted) setInitialData(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load item for editing.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadItem();
    return () => { mounted = false; };
  }, [id, isEditMode]);

  const handleEditSubmit = async (formData, imageFile) => {
    // If editing existing item:
    try {
      const updated = await updateFoundItem(id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        color: formData.color,
        foundDate: formData.foundDate,
        building: formData.building,
        floor: formData.floor,
        locationDescription: formData.locationDescription,
      });
      replaceItem(updated);
      navigate(`/found-items/${id}`);
    } catch (err) {
      alert(err.message || "Failed to update found item.");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" text="Loading found item data..." />
      </div>
    );
  }

  return (
    <div className="page-container form-page-container">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header */}
      <div className="form-page-header">
        <div className="form-page-icon found">
          {isEditMode ? <Edit3 size={24} /> : <ShieldCheck size={24} />}
        </div>
        <div>
          <h1 className="form-page-title">
            {isEditMode ? "Edit Found Item Record" : "Register Found Item"}
          </h1>
          <p className="form-page-subtitle">
            {isEditMode
              ? "Update details for this found item in the university database."
              : "Register an item handed in to lost & found. This allows students to claim their lost belongings."}
          </p>
        </div>
      </div>

      {error ? (
        <div className="page-error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      ) : isEditMode ? (
        <FoundItemForm
          initialValues={initialData}
          submitLabel="Save Changes"
          onSuccess={() => navigate(`/found-items/${id}`)}
        />
      ) : (
        <FoundItemForm submitLabel="Register Found Item" />
      )}
    </div>
  );
}

export default RegisterFoundItemPage;
