import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthLayout from "../../../layouts/AuthLayout";
import LoginForm from "../components/LoginForm";

export const LoginPage = () => {
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign In - UIU Lost & Found Portal";
  }, []);

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      // Errors are handled in AuthContext and exposed via error state
    }
  };

  return (
    <AuthLayout>
      <LoginForm
        onLogin={handleLogin}
        loading={loading}
        error={error}
        onClearError={clearError}
      />
    </AuthLayout>
  );
};

export default LoginPage;
