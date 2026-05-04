import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  fetchPendingCandidates,
  updateCandidateStatus,
  fetchCandidateStats,
  fetchEventAnalytics,
  BASE_URL
} from "../services/api.js";

const StaffPanel = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState(null);
  const [eventAnalytics, setEventAnalytics] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const socketUrl = BASE_URL.replace(/\/api\/?$/, "");
  const token = window.localStorage.getItem("staffToken");

  useEffect(() => {
    if (!token) {
      navigate("/staff");
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [pendingRes, statsRes, eventRes] = await Promise.all([
          fetchPendingCandidates(token),
          fetchCandidateStats(token),
          fetchEventAnalytics(token)
        ]);
        setPending(pendingRes.data);
        setStats(statsRes.data);
        setEventAnalytics(eventRes.data);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        if (error.response?.status === 401) {
          navigate("/staff");
        } else {
          setMessage({ type: "error", text: "Failed to load dashboard data." });
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate, token, refreshKey]);

  useEffect(() => {
    if (!token) return;
    const socket = io(socketUrl, { transports: ["websocket"] });

    socket.on("candidateCreated", () => setRefreshKey(prev => prev + 1));
    socket.on("voteUpdated", () => setRefreshKey(prev => prev + 1));
    socket.on("candidateStatus", () => setRefreshKey(prev => prev + 1));

    return () => socket.disconnect();
  }, [socketUrl, token]);

  const handleAction = async (candidateId, status) => {
    try {
      await updateCandidateStatus(candidateId, status, token);
      setMessage({ type: "success", text: `Candidate ${status} successfully.` });
      setRefreshKey(prev => prev + 1);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Action failed." });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("staffToken");
    navigate("/staff");
  };

  if (loading && !stats) return <div className="app-main"><div className="card" style={{ textAlign: 'center' }}>Initializing Staff Terminal...</div></div>;

  return (
    <div className="app-main" style={{ maxWidth: '1200px' }}>
      <header className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', padding: '2rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '2.5rem' }}>Staff Overview</h1>
          <p className="page-copy" style={{ marginBottom: 0 }}>Digital Management Suite for Wasantha Udanaya 2026</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="secondary-btn" onClick={() => setRefreshKey(k => k + 1)} style={{ width: 'auto', padding: '0.8rem 1.5rem', background: 'rgba(245, 190, 126, 0.05)', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '14px', cursor: 'pointer', fontWeight: '600' }}>Refresh Data</button>
          <button className="primary" onClick={handleLogout} style={{ width: 'auto', padding: '0.8rem 1.5rem' }}>Logout</button>
        </div>
      </header>

      {message && (
        <div className="card" style={{ textAlign: 'center', borderColor: message.type === "success" ? "#2f7c43" : "#a33c3c", padding: '1rem' }}>
          <p style={{ margin: 0 }}>{message.text}</p>
        </div>
      )}

      {/* Navigation Shortcuts */}
      <div className="action-grid" style={{ marginBottom: '3rem' }}>
        <Link to="/staff/candidates" className="action-card" style={{ padding: '2rem' }}>
          <div className="action-card-content">
             <div className="icon-wrapper" style={{ background: 'rgba(245, 190, 126, 0.1)', color: 'var(--gold)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
             </div>
             <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Candidate Management</h3>
             <p style={{ fontSize: '0.9rem' }}>Real-time leaderboard, search ID, and disqualification tools.</p>
             <span className="explore-link">Access Voting Records →</span>
          </div>
        </Link>
        <Link to="/staff/registrations" className="action-card" style={{ padding: '2rem' }}>
          <div className="action-card-content">
             <div className="icon-wrapper" style={{ background: 'rgba(245, 190, 126, 0.1)', color: 'var(--gold)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             </div>
             <h3 style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Registration Desk</h3>
             <p style={{ fontSize: '0.9rem' }}>Participant search, event participation counts, and form deletion.</p>
             <span className="explore-link">Access Participant List →</span>
          </div>
        </Link>
      </div>

      {/* Summary Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ margin: 0, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--gold)', opacity: 0.05, borderRadius: '50%' }}></div>
          <p className="category-label" style={{ letterSpacing: '2px' }}>Approved Princes</p>
          <h2 style={{ fontSize: '4rem', color: 'var(--gold)', margin: '0.5rem 0', fontWeight: '800' }}>{stats?.princeCount || 0}</h2>
        </div>
        <div className="card" style={{ margin: 0, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--gold)', opacity: 0.05, borderRadius: '50%' }}></div>
          <p className="category-label" style={{ letterSpacing: '2px' }}>Approved Princesses</p>
          <h2 style={{ fontSize: '4rem', color: 'var(--gold)', margin: '0.5rem 0', fontWeight: '800' }}>{stats?.princessCount || 0}</h2>
        </div>
        <div className="card" style={{ margin: 0, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--vermillion)', opacity: 0.05, borderRadius: '50%' }}></div>
          <p className="category-label" style={{ letterSpacing: '2px' }}>Action Required</p>
          <h2 style={{ fontSize: '4rem', color: pending.length > 0 ? '#ff6b6b' : 'var(--gold)', margin: '0.5rem 0', fontWeight: '800' }}>{pending.length}</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Pending Approvals</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Top 3 Princes */}
        <div className="staff-card" style={{ margin: 0, padding: '2rem', borderRadius: '32px' }}>
          <h2 className="brand-label" style={{ marginBottom: '2rem', fontSize: '1.4rem', color: 'var(--gold)' }}>Top Voted Princes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {stats?.topPrinces.map((c, i) => (
              <div key={c.candidateId} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--gold)', width: '40px', textAlign: 'center' }}>#{i+1}</span>
                <img src={c.profilePhotoUrl} alt="" style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover', border: '2px solid var(--gold)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6, fontFamily: 'monospace' }}>{c.candidateId}</p>
                </div>
                <div style={{ textAlign: 'right', background: 'rgba(245, 190, 126, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                  <p style={{ margin: 0, fontWeight: '900', color: 'var(--gold)', fontSize: '1.2rem' }}>{c.votes}</p>
                  <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}>Votes</p>
                </div>
              </div>
            ))}
            {stats?.topPrinces.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No approved prince candidates.</p>}
          </div>
        </div>

        {/* Top 3 Princesses */}
        <div className="staff-card" style={{ margin: 0, padding: '2rem', borderRadius: '32px' }}>
          <h2 className="brand-label" style={{ marginBottom: '2rem', fontSize: '1.4rem', color: 'var(--gold)' }}>Top Voted Princesses</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {stats?.topPrincesses.map((c, i) => (
              <div key={c.candidateId} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--gold)', width: '40px', textAlign: 'center' }}>#{i+1}</span>
                <img src={c.profilePhotoUrl} alt="" style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover', border: '2px solid var(--gold)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>{c.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6, fontFamily: 'monospace' }}>{c.candidateId}</p>
                </div>
                <div style={{ textAlign: 'right', background: 'rgba(245, 190, 126, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                  <p style={{ margin: 0, fontWeight: '900', color: 'var(--gold)', fontSize: '1.2rem' }}>{c.votes}</p>
                  <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}>Votes</p>
                </div>
              </div>
            ))}
            {stats?.topPrincesses.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No approved princess candidates.</p>}
          </div>
        </div>
      </div>

      {/* Event Participation Stats */}
      <section className="staff-card" style={{ marginBottom: '3rem', padding: '2rem', borderRadius: '32px' }}>
        <h2 className="brand-label" style={{ marginBottom: '2rem', fontSize: '1.4rem', color: 'var(--gold)' }}>Event Participation (High to Low)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {eventAnalytics.map(event => (
            <div key={event.name} style={{ padding: '1.5rem', background: 'rgba(245, 190, 126, 0.03)', borderRadius: '24px', border: '1px solid rgba(245, 190, 126, 0.1)', textAlign: 'center', transition: '0.3s' }} className="stat-hover">
              <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.8rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1.2' }}>{event.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--gold)' }}>{event.count}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 'bold' }}>Entries</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Approval Section */}
      <section className="staff-card" style={{ padding: '2rem', borderRadius: '32px' }}>
        <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', fontFamily: 'Playfair Display', fontSize: '1.8rem' }}>
          Pending Applications ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="page-copy" style={{ textAlign: 'center', padding: '2rem' }}>No new applications waiting for review. All clear!</p>
        ) : (
          <div className="pending-grid">
            {pending.map((candidate) => (
              <article key={candidate.candidateId} className="card" style={{ margin: 0, padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <img src={candidate.profilePhotoUrl} alt={candidate.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '18px', border: '2px solid var(--gold)' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{candidate.name}</h3>
                    <p className="category-label" style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>{candidate.role} • {candidate.batch}</p>
                    <p style={{ fontSize: '0.8rem', margin: '0.5rem 0', opacity: 0.7, fontFamily: 'monospace' }}>ID: {candidate.candidateId}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', margin: '1.2rem 0', color: 'var(--text-dim)', minHeight: '3rem', fontStyle: 'italic' }}>"{candidate.description}"</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button className="approve-button" onClick={() => handleAction(candidate.candidateId, "approved")} style={{ fontSize: '0.8rem', padding: '0.8rem', borderRadius: '12px', background: 'linear-gradient(135deg, #2e8f4b, #1e5f32)', color: 'white', border: 'none', fontWeight: '700' }}>Approve</button>
                  <button className="reject-button" onClick={() => handleAction(candidate.candidateId, "rejected")} style={{ fontSize: '0.8rem', padding: '0.8rem', borderRadius: '12px', background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', fontWeight: '700' }}>Reject</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx="true">{`
        .stat-hover:hover {
          transform: translateY(-5px);
          background: rgba(245, 190, 126, 0.08) !important;
          border-color: var(--gold) !important;
        }
      `}</style>
    </div>
  );
};

export default StaffPanel;
