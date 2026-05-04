import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { fetchAllCandidates, fetchPendingCandidates, updateCandidateStatus } from "../services/api.js";

const StaffPanel = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const socketUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000";
  const token = window.localStorage.getItem("staffToken");

  useEffect(() => {
    if (!token) {
      navigate("/staff");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [pendingRes, allRes] = await Promise.all([fetchPendingCandidates(token), fetchAllCandidates(token)]);
        setPending(pendingRes.data);
        setAllCandidates(allRes.data);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        if (error.response) {
            // Server responded with an error (4xx, 5xx)
            if (error.response.status === 401) {
                setMessage({ type: "error", text: "Session expired. Please login again." });
                setTimeout(() => navigate("/staff"), 2000);
            } else {
                setMessage({ type: "error", text: `Server Error (${error.response.status}): ${error.response.data?.error || "Unknown error"}` });
            }
        } else if (error.request) {
            // Request was made but no response received
            setMessage({ type: "error", text: "Connection Failed. The backend server is not responding. Ensure it is running on port 5000." });
        } else {
            setMessage({ type: "error", text: "An unexpected error occurred. Check browser console for details." });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, token, refreshKey]);

  useEffect(() => {
    if (!token) return;

    const socket = io(socketUrl, { transports: ["websocket"] });

    socket.on("candidateCreated", (newCandidate) => {
      console.log("Socket: New candidate created", newCandidate);
      setPending(prev => {
        if (prev.find(c => c.candidateId === newCandidate.candidateId)) return prev;
        return [newCandidate, ...prev];
      });
      setAllCandidates(prev => {
        if (prev.find(c => c.candidateId === newCandidate.candidateId)) return prev;
        return [newCandidate, ...prev];
      });
      setMessage({ type: "success", text: `New application: ${newCandidate.name}` });
      setTimeout(() => setMessage(null), 5000);
    });

    socket.on("candidateStatus", ({ candidate, leaderboard }) => {
      console.log("Socket: Candidate status updated", candidate);

      // Update in allCandidates
      setAllCandidates(prev => prev.map(c => c.candidateId === candidate.candidateId ? candidate : c));

      // Update in pending
      if (candidate.status !== 'pending') {
        setPending(prev => prev.filter(c => c.candidateId !== candidate.candidateId));
      } else {
        setPending(prev => prev.map(c => c.candidateId === candidate.candidateId ? candidate : c));
      }
    });

    return () => socket.disconnect();
  }, [socketUrl, token]);

  const handleAction = async (candidateId, status) => {
    console.log(`Frontend sending status update: ${candidateId} -> ${status}`);
    try {
      const response = await updateCandidateStatus(candidateId, status, token);
      console.log("Server response for status update:", response.data);

      setMessage({ type: "success", text: `Candidate ${status} successfully.` });

      // Force immediate re-fetch
      setRefreshKey(prev => prev + 1);

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Frontend Status Update Error:", error);
      setMessage({ type: "error", text: error.response?.data?.error || "Action failed." });
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("staffToken");
    navigate("/staff");
  };

  if (loading) return <div className="app-main"><p>Loading dashboard...</p></div>;

  return (
    <section>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Staff Dashboard</h1>
          <p className="page-copy" style={{ marginBottom: 0 }}>Review and moderate candidate applications.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="secondary-btn" onClick={handleRefresh} style={{ width: 'auto', padding: '0.6rem 1.2rem', background: 'rgba(245, 190, 126, 0.1)', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '12px', cursor: 'pointer' }}>Refresh</button>
          <button className="primary" onClick={handleLogout} style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>Logout</button>
        </div>
      </div>

      {message && (
        <div className="card" style={{ textAlign: 'center', borderColor: message.type === "success" ? "#2f7c43" : "#a33c3c" }}>
          <p>{message.text}</p>
        </div>
      )}

      <div className="staff-card">
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Pending Approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="page-copy">No pending applications to review.</p>
        ) : (
          <div className="pending-grid">
            {pending.map((candidate) => (
              <article key={candidate.candidateId} className="card" style={{ margin: 0, padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <img src={candidate.profilePhotoUrl} alt={candidate.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--gold)' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{candidate.name}</h3>
                    <p className="category-label" style={{ fontSize: '0.7rem' }}>{candidate.role} • {candidate.batch}</p>
                    <p style={{ fontSize: '0.8rem', margin: '0.3rem 0', opacity: 0.8 }}>ID: {candidate.candidateId}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', margin: '1rem 0', color: 'var(--text-dim)' }}>{candidate.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <button className="approve-button" onClick={() => handleAction(candidate.candidateId, "approved")} style={{ fontSize: '0.8rem', padding: '0.5rem' }}>Approve</button>
                  <button className="reject-button" onClick={() => handleAction(candidate.candidateId, "rejected")} style={{ fontSize: '0.8rem', padding: '0.5rem' }}>Reject</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="staff-card" style={{ overflowX: 'auto' }}>
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          All Candidates
        </h2>
        {allCandidates.length === 0 ? (
          <p className="page-copy">No candidates found.</p>
        ) : (
          <table style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {allCandidates.map((candidate) => (
                <tr key={candidate.candidateId}>
                  <td style={{ fontSize: '0.8rem' }}>{candidate.candidateId}</td>
                  <td>
                    <img src={candidate.profilePhotoUrl} alt={candidate.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                  </td>
                  <td>{candidate.name}</td>
                  <td>{candidate.role}</td>
                  <td>
                    <span className="status-pill" style={{
                      fontSize: '0.7rem',
                      background: candidate.status === 'approved' ? 'rgba(46, 143, 75, 0.2)' : candidate.status === 'rejected' ? 'rgba(163, 60, 60, 0.2)' : 'rgba(245, 190, 126, 0.1)',
                      borderColor: candidate.status === 'approved' ? '#2e8f4b' : candidate.status === 'rejected' ? '#a33c3c' : 'var(--gold)'
                    }}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>{candidate.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default StaffPanel;
