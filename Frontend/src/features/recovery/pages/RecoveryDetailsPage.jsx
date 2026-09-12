import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import RecoveryDetails from "../components/RecoveryDetails";
import { getRecoveryById } from "../services/recovery.service";
import LoadingSpinner from "../../../components/LoadingSpinner";

/**
 * RecoveryDetailsPage — Full page container for viewing a single recovery record
 */
export function RecoveryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recovery, setRecovery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadRecovery() {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecoveryById(id);
        if (mounted) setRecovery(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load recovery details.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRecovery();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" text="Loading physical recovery record..." />
      </div>
    );
  }

  if (error || !recovery) {
    return (
      <div className="page-container">
        <div className="page-error-state">
          <AlertTriangle size={48} />
          <h2>Recovery Record Not Found</h2>
          <p>{error || "The requested recovery record could not be retrieved."}</p>
          <button className="btn-primary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <RecoveryDetails recovery={recovery} />
    </div>
  );
}

export default RecoveryDetailsPage;
