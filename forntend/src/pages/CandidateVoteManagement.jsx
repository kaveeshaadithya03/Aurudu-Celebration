import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllCandidates, updateCandidateStatus } from "../services/api.js";

const LiyawelaSVG = () => (
  <svg viewBox="0 0 100 100" className="liyawela-corner liyawela-top-right" preserveAspectRatio="none">
    <path d="M100,0 C80,20 60,0 40,20 C20,40 40,60 20,80 C0,100 0,100 0,100" stroke="var(--gold)" fill="none" strokeWidth="2" opacity="0.3" />
    <circle cx="85" cy="15" r="3" fill="var(--gold)" opacity="0.5" />
    <circle cx="65" cy="35" r="2" fill="var(--gold)" opacity="0.4" />
  </svg>
);

const CandidateVoteManagement = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const token = window.localStorage.getItem("staffToken");

  useEffect(() => {
    if (!token) {
      navigate("/staff");
      return;
    }

    const loadCandidates = async () => {
      try {
        const response = await fetchAllCandidates(token);
        setCandidates(response.data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load candidates." });
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [token, navigate]);

  const handleReject = async (candidateId) => {
    if (!window.confirm("Are you sure you want to reject and disqualify this candidate? They will not be able to register again with this ID.")) return;
    try {
      await updateCandidateStatus(candidateId, "rejected", token);
      setCandidates(prev => prev.map(c => c.candidateId === candidateId ? { ...c, status: "rejected" } : c));
      setMessage({ type: "success", text: "Candidate has been disqualified." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to reject candidate." });
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c =>
      c.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  const princes = filteredCandidates
    .filter(c => c.role === "Prince")
    .sort((a, b) => b.votes - a.votes);

  const princesses = filteredCandidates
    .filter(c => c.role === "Princess")
    .sort((a, b) => b.votes - a.votes);

  if (loading) return <div className="app-main"><div className="card" style={{ textAlign: 'center' }}>Loading candidate records...</div></div>;

  return (
    <div className="app-main" style={{ maxWidth: '1100px' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="page-title">Candidate Moderation</h1>
        <p className="page-copy">Monitor voting records and manage competitor eligibility.</p>
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

      <div className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
        <LiyawelaSVG />
        <div className="input-group">
          <label style={{ fontSize: '1rem', fontWeight: '600' }}>
            Search Competitor
            <input
              type="text"
              placeholder="Search by Student ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '1.2rem', fontSize: '1.1rem' }}
            />
          </label>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.6 }}>
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </p>
      </div>

      {/* Princes Section */}
      <section className="management-section" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
           <h2 className="brand-label" style={{ margin: 0, fontSize: '2rem' }}>New Year Princes</h2>
           <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, var(--gold), transparent)', opacity: 0.3 }}></div>
        </div>

        <div className="staff-card" style={{ overflowX: 'auto', padding: '1.5rem', borderRadius: '24px' }}>
          <table className="management-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Photo</th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Batch Info</th>
                <th>Votes</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {princes.map((c, index) => (
                <tr key={c.candidateId} className={c.status === 'rejected' ? 'row-rejected' : ''}>
                  <td style={{ fontWeight: '900', color: 'var(--gold)', fontSize: '1.2rem' }}>#{index + 1}</td>
                  <td>
                    <img src={c.profilePhotoUrl} alt="" style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--gold)' }} />
                  </td>
                  <td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{c.candidateId}</td>
                  <td style={{ fontWeight: '600' }}>{c.name}</td>
                  <td style={{ fontSize: '0.8rem' }}>{c.batch}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '1.1rem' }}>{c.votes}</td>
                  <td>
                    <span className={`status-pill ${c.status}`}>{c.status}</span>
                  </td>
                  <td>
                    {c.status !== 'rejected' ? (
                      <button className="reject-button" onClick={() => handleReject(c.candidateId)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Reject</button>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#a33c3c', fontStyle: 'italic' }}>Disqualified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {princes.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', opacity: 0.5, fontStyle: 'italic' }}>No prince candidates found matching search.</p>}
        </div>
      </section>

      {/* Princesses Section */}
      <section className="management-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
           <h2 className="brand-label" style={{ margin: 0, fontSize: '2rem' }}>New Year Princesses</h2>
           <div style={{ height: '2px', flex: 1, background: 'linear-gradient(90deg, var(--gold), transparent)', opacity: 0.3 }}></div>
        </div>

        <div className="staff-card" style={{ overflowX: 'auto', padding: '1.5rem', borderRadius: '24px' }}>
          <table className="management-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Photo</th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Batch Info</th>
                <th>Votes</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {princesses.map((c, index) => (
                <tr key={c.candidateId} className={c.status === 'rejected' ? 'row-rejected' : ''}>
                  <td style={{ fontWeight: '900', color: 'var(--gold)', fontSize: '1.2rem' }}>#{index + 1}</td>
                  <td>
                    <img src={c.profilePhotoUrl} alt="" style={{ width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--gold)' }} />
                  </td>
                  <td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{c.candidateId}</td>
                  <td style={{ fontWeight: '600' }}>{c.name}</td>
                  <td style={{ fontSize: '0.8rem' }}>{c.batch}</td>
                  <td style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '1.1rem' }}>{c.votes}</td>
                  <td>
                    <span className={`status-pill ${c.status}`}>{c.status}</span>
                  </td>
                  <td>
                    {c.status !== 'rejected' ? (
                      <button className="reject-button" onClick={() => handleReject(c.candidateId)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Reject</button>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#a33c3c', fontStyle: 'italic' }}>Disqualified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {princesses.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', opacity: 0.5, fontStyle: 'italic' }}>No princess candidates found matching search.</p>}
        </div>
      </section>

      <style jsx="true">{`
        .management-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.5rem;
          font-size: 0.9rem;
        }
        .management-table th {
          padding: 1.2rem 1rem;
          text-align: left;
          color: var(--gold);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          border-bottom: 1px solid rgba(245, 190, 126, 0.2);
        }
        .management-table td {
          padding: 1.2rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: 0.3s;
        }
        .management-table tr:hover td {
          background: rgba(255, 255, 255, 0.03);
        }
        .row-rejected {
          opacity: 0.4;
          background: rgba(163, 60, 60, 0.05);
        }
        .status-pill {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-pill.approved { background: rgba(46, 143, 75, 0.2); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
        .status-pill.pending { background: rgba(245, 190, 126, 0.1); color: var(--gold); border: 1px solid rgba(245, 190, 126, 0.3); }
        .status-pill.rejected { background: rgba(163, 60, 60, 0.2); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
      `}</style>
    </div>
  );
};

export default CandidateVoteManagement;
