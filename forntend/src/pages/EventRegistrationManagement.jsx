import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRegistrations, fetchEventAnalytics, deleteRegistration } from "../services/api.js";

const SunSVG = () => (
  <svg viewBox="0 0 100 100" width="80" height="80" style={{ opacity: 0.15, position: 'absolute', top: '10px', right: '10px' }} className="rotating">
    <circle cx="50" cy="50" r="20" fill="var(--gold)" />
    {[...Array(12)].map((_, i) => (
      <line
        key={i}
        x1="50" y1="20" x2="50" y2="5"
        stroke="var(--gold)" strokeWidth="4" strokeLinecap="round"
        transform={`rotate(${i * 30} 50 50)`}
      />
    ))}
  </svg>
);

const EventRegistrationManagement = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const token = window.localStorage.getItem("staffToken");

  useEffect(() => {
    if (!token) {
      navigate("/staff");
      return;
    }

    const loadData = async () => {
      try {
        const [regRes, anaRes] = await Promise.all([
          fetchRegistrations(token),
          fetchEventAnalytics(token)
        ]);
        setRegistrations(regRes.data);
        setAnalytics(anaRes.data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load registration data." });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    try {
      const res = await fetchRegistrations(token, term);
      setRegistrations(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ARE YOU SURE? This will permanently delete the entire registration for this participant. This cannot be undone.")) return;
    try {
      await deleteRegistration(id, token);
      setRegistrations(prev => prev.filter(r => r._id !== id));
      setMessage({ type: "success", text: "Registration deleted successfully." });
      // Refresh analytics
      const anaRes = await fetchEventAnalytics(token);
      setAnalytics(anaRes.data);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete registration." });
    }
  };

  if (loading) return <div className="app-main"><div className="card" style={{ textAlign: 'center' }}>Loading event participants...</div></div>;

  return (
    <div className="app-main" style={{ maxWidth: '1100px' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="page-title">Registration Desk</h1>
        <p className="page-copy">Manage event participant lists and monitor game attendance.</p>
      </header>

      {message && (
        <div className="status-toast" style={{
          background: message.type === 'success' ? '#2e8f4b' : '#a33c3c',
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, padding: '1rem 2rem', borderRadius: '15px'
        }}>
          {message.text}
        </div>
      )}

      <section className="management-section" style={{ marginBottom: '3rem' }}>
        <h2 className="brand-label" style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--gold)' }}>Event Popularity</h2>
        <div className="staff-card" style={{ padding: '2rem', position: 'relative' }}>
          <SunSVG />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {analytics.map(item => (
              <div key={item.name} className="card" style={{ margin: 0, padding: '1.2rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(245, 190, 126, 0.1)' }}>
                <p className="category-label" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>{item.name}</p>
                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--gold)', margin: '0.5rem 0' }}>{item.count}</p>
                <p style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Contestants</p>
              </div>
            ))}
          </div>
          {analytics.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No participation data recorded yet.</p>}
        </div>
      </section>

      <div className="card" style={{ marginBottom: '3rem', padding: '1.5rem' }}>
        <div className="input-group">
          <label>
            Find Participant
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ fontSize: '1.1rem' }}
            />
          </label>
        </div>
      </div>

      <section className="management-section">
        <h2 className="brand-label" style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--gold)' }}>Participant Roster</h2>
        <div className="staff-card" style={{ overflowX: 'auto', padding: '1.5rem' }}>
          <table className="management-table">
            <thead>
              <tr>
                <th>Participant Name</th>
                <th>Student ID</th>
                <th>Gender</th>
                <th>Batch</th>
                <th>Contact</th>
                <th>Selected Events</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: '700', fontSize: '1rem' }}>{r.name}</td>
                  <td style={{ fontFamily: 'monospace' }}>{r.participantId}</td>
                  <td>{r.gender}</td>
                  <td>{r.batch}</td>
                  <td style={{ fontSize: '0.85rem' }}>{r.contact}</td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxWidth: '300px' }}>
                      {r.events.map(e => (
                        <span key={e} style={{
                          fontSize: '0.6rem',
                          padding: '0.2rem 0.6rem',
                          background: 'rgba(245, 190, 126, 0.1)',
                          color: 'var(--gold)',
                          border: '1px solid rgba(245, 190, 126, 0.2)',
                          borderRadius: '12px',
                          whiteSpace: 'nowrap'
                        }}>
                          {e}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button className="reject-button" onClick={() => handleDelete(r._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: 'rgba(163, 60, 60, 0.2)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.2)' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {registrations.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No registrations found.</p>}
        </div>
      </section>

      <style jsx="true">{`
        .management-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .management-table th {
          padding: 1.2rem 1rem;
          text-align: left;
          color: var(--gold);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          border-bottom: 2px solid rgba(245, 190, 126, 0.2);
        }
        .management-table td {
          padding: 1.2rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .management-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};

export default EventRegistrationManagement;
