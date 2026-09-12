import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { apiRequest } from "../../../services/api.service";

const googleProvider = new GoogleAuthProvider();
// Force account selection prompt each time if needed
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Perform Firebase Google Sign-In via popup
 * @returns {Promise<{user: import('firebase/auth').User, idToken: string}>}
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const idToken = await user.getIdToken();
  return {
    user,
    idToken,
  };
};

/**
 * Fetch authenticated user details from backend GET /api/auth/me
 * @param {string} idToken
 * @returns {Promise<Object>} Backend user object containing role, uid, email, etc.
 */
export const fetchCurrentUser = async (idToken) => {
  const response = await apiRequest("/auth/me", {
    method: "GET",
    token: idToken,
  });

  return response.data;
};

/**
 * Sign out user from Firebase Auth
 */
export const logoutUser = async () => {
  await signOut(auth);
};
