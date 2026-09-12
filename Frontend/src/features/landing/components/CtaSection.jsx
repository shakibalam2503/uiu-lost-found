import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import Button from "../../../components/ui/button";
import useAuth from "../../auth/hooks/useAuth";

export const CtaSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="cta-banner-section">
      <div className="cta-banner-card">
        <div className="cta-content">
          <h2 className="cta-title">
            Lost or Found Something on Campus Today?
          </h2>
          <p className="cta-subtitle">
            Sign in with your official UIU email (`@bscse.uiu.ac.bd` or `@uiu.ac.bd`)
            to post a report or search verified items across campus instantly.
          </p>
        </div>

        <div className="cta-actions">
          <Button variant="gradient" size="lg" onClick={handleClick}>
            {isAuthenticated ? (
              <>
                <ShieldCheck size={20} />
                <span>Go to Campus Dashboard</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In with UIU Email</span>
              </>
            )}
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
