import { createContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { signInWithGoogle, fetchCurrentUser, logoutUser } from "./services/auth.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  /**
   * Sync Firebase user with backend /api/auth/me
   */
  const syncBackendUser = useCallback(async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const backendUserData = await fetchCurrentUser(idToken);
      setUser(backendUserData);
      setAuthError(null);
      return backendUserData;
    } catch (err) {
      console.error("Backend auth sync error:", err);

      // Handle university domain restriction
      if (err.code === "UNIVERSITY_ACCOUNT_REQUIRED" || err.status === 403) {
        setAuthError({
          code: "UNIVERSITY_ACCOUNT_REQUIRED",
          message: "University account required. Please sign in with an official university email address.",
        });
      } else {
        setAuthError({
          code: err.code || "AUTH_FAILED",
          message: err.message || "Failed to authenticate with university server.",
        });
      }

      // If backend verification failed, sign out from Firebase
      await logoutUser().catch(() => {});
      setUser(null);
      throw err;
    }
  }, []);

  // Firebase auth state listener (for session persistence)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          await syncBackendUser(firebaseUser);
        } catch (err) {
          // Handled inside syncBackendUser
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncBackendUser]);

  /**
   * Google Sign-In trigger
   */
  const login = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const { user: firebaseUser } = await signInWithGoogle();
      const backendUser = await syncBackendUser(firebaseUser);
      setLoading(false);
      return backendUser;
    } catch (err) {
      console.error("Login failed:", err);
      // Firebase popup errors
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError({
          code: "POPUP_CLOSED",
          message: "Sign-in popup was closed before completing authentication.",
        });
      } else if (err.code === "auth/popup-blocked") {
        setAuthError({
          code: "POPUP_BLOCKED",
          message: "Sign-in popup was blocked by your browser. Please allow popups for this site.",
        });
      } else if (!authError) {
        setAuthError({
          code: err.code || "LOGIN_FAILED",
          message: err.message || "An error occurred during Google sign-in.",
        });
      }
      setLoading(false);
      throw err;
    }
  }, [syncBackendUser, authError]);

  /**
   * Logout trigger
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setAuthError(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    error: authError,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
