import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const submitRegistration = (payload) => api.post("/registrations", payload);
export const submitCandidate = (formData) => api.post("/candidates", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const fetchCandidates = () => api.get("/candidates").then((res) => res.data);
export const fetchCandidateById = (candidateId) => api.get(`/candidates/${candidateId}`).then((res) => res.data);
export const voteCandidate = (candidateId) => api.post(`/candidates/${candidateId}/vote`);
export const staffLogin = (credentials) => api.post("/staff/login", credentials);
export const fetchPendingCandidates = (token) => api.get("/candidates/pending", { headers: { Authorization: `Bearer ${token}` } });
export const fetchAllCandidates = (token) => api.get("/candidates/all", { headers: { Authorization: `Bearer ${token}` } });
export const updateCandidateStatus = (candidateId, status, token) => api.put(`/candidates/${candidateId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
