import axios from "axios";

export const BASE_URL = "https://aurudu-celebration.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Candidate APIs
export const submitCandidate = (formData) => api.post("/candidates", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const fetchCandidates = () => api.get("/candidates").then((res) => res.data);
export const fetchCandidateById = (candidateId) => api.get(`/candidates/${candidateId}`).then((res) => res.data);
export const voteCandidate = (candidateId) => api.post(`/candidates/${candidateId}/vote`);
export const updateCandidateStatus = (candidateId, status, token) => api.put(`/candidates/${candidateId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
export const fetchPendingCandidates = (token) => api.get("/candidates/pending", { headers: { Authorization: `Bearer ${token}` } });
export const fetchAllCandidates = (token) => api.get("/candidates/all", { headers: { Authorization: `Bearer ${token}` } });
export const fetchCandidateStats = (token) => api.get("/candidates/stats", { headers: { Authorization: `Bearer ${token}` } });

// Registration APIs
export const submitRegistration = (payload) => api.post("/registrations", payload);
export const fetchRegistrations = (token, search = "") => api.get(`/registrations${search ? `?search=${search}` : ""}`, { headers: { Authorization: `Bearer ${token}` } });
export const fetchEventAnalytics = (token) => api.get("/registrations/analytics", { headers: { Authorization: `Bearer ${token}` } });
export const deleteRegistration = (id, token) => api.delete(`/registrations/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Staff Auth
export const staffLogin = (credentials) => api.post("/staff/login", credentials);
