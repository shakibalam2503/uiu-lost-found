import { apiRequest } from "../../../services/api.service";
import { getAuth } from "firebase/auth";

const getTokens = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

export const createFoundTicket = async (formData) => {
  const token = await getTokens();
  // Using native fetch because apiRequest uses JSON body by default
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const url = `${API_BASE_URL}/found-tickets`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // browser automatically sets boundary for multipart/form-data
  });

  let jsonResult = null;
  try {
    jsonResult = await response.json();
  } catch (e) {
    if (!response.ok) {
      throw new Error(`Server returned error status: ${response.status}`);
    }
  }

  if (!response.ok || (jsonResult && jsonResult.success === false)) {
    const message = jsonResult?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return jsonResult;
};

export const getMyFoundTickets = async () => {
  const token = await getTokens();
  const data = await apiRequest("/found-tickets/my", { method: "GET", token });
  return data.data; // assuming standard API wrapper returns { success: true, data: [...] }
};

export const getFoundTickets = async () => {
  const token = await getTokens();
  const data = await apiRequest("/found-tickets", { method: "GET", token });
  return data.data;
};

export const getFoundTicketById = async (id) => {
  const token = await getTokens();
  const data = await apiRequest(`/found-tickets/${id}`, { method: "GET", token });
  return data.data;
};

export const updateFoundTicketStatus = async (id, status, staffNote) => {
  const token = await getTokens();
  const body = { status, staffNote };
  const data = await apiRequest(`/found-tickets/${id}/status`, {
    method: "PATCH",
    token,
    body,
  });
  return data.data;
};
