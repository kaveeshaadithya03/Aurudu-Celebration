import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCandidates, voteCandidate, BASE_URL } from "../services/api.js";

const VoteBoard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [votingEndsAt, setVotingEndsAt] = useState(null);
  const [timerLabel, setTimerLabel] = useState("Loading countdown...");

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const data = await fetchCandidates();
        setCandidates(data.candidates || data);
        if (data.votingEndsAt) {
          setVotingEndsAt(new Date(data.votingEndsAt));
        }
      } catch (error) {
        setMessage({ type: "error", text: "Unable to load voting board." });
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  useEffect(() => {
    if (!votingEndsAt) return;
    const updateTimer = () => {
      const diff = votingEndsAt.getTime() - Date.now();
      if (diff <= 0) {
        setTimerLabel("Voting has ended.");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimerLabel(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(interval);
  }, [votingEndsAt]);

  const handleVote = async (e, candidateId) => {
    e.preventDefault();
    e.stopPropagation();
    if (localStorage.getItem(`voted-${candidateId}`)) {
      setMessage({ type: "error", text: "You have already voted for this candidate." });
      return;
    }

    try {
      await voteCandidate(candidateId);
      localStorage.setItem(`voted-${candidateId}`, "true");
      setMessage({ type: "success", text: "Vote recorded. Thank you for voting!" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Unable to submit vote." });
    }
  };

  const princes = useMemo(() =>
    candidates.filter(c => c.role === "Prince").sort((a, b) => b.votes - a.votes),
    [candidates]
  );

  const princesses = useMemo(() =>
    candidates.filter(c => c.role === "Princess").sort((a, b) => b.votes - a.votes),
    [candidates]
  );

  const CandidateCard = ({ candidate, index }) => (
    <Link to={`/candidate/${candidate.candidateId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="vote-card">
        <span className="rank-badge">Rank #{index + 1}</span>
        {candidate.profilePhotoUrl && <img className="profile-photo" src={candidate.profilePhotoUrl} alt={candidate.name} />}
        <h2>{candidate.name}</h2>
        <p className="category-label">{candidate.role} • Batch {candidate.batch}</p>
        <div className="vote-count">{candidate.votes} Votes</div>
        <p className="page-copy" style={{ fontSize: '0.85rem', minHeight: '3em' }}>
          {candidate.description || "Traditional competition participant."}
        </p>
        <button
          className="vote-button"
          type="button"
          onClick={(e) => handleVote(e, candidate.candidateId)}
          disabled={Date.now() > (votingEndsAt?.getTime() || 0) || localStorage.getItem(`voted-${candidate.candidateId}`)}
        >
          {localStorage.getItem(`voted-${candidate.candidateId}`) ? "Voted" : "Cast Vote"}
        </button>
      </article>
    </Link>
  );

  return (
    <section>
      <div className="card hero-section" style={{ padding: '2rem 1rem' }}>
        <h1 className="page-title">Voting Board</h1>
        <p className="page-copy">Choose your favorite New Year Prince and Princess.</p>
        <div className="status-pill" style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
          {timerLabel}
        </div>
      </div>

      {message && (
        <div className="card" style={{ borderColor: message.type === "success" ? "#2f7c43" : "#a33c3c", textAlign: 'center' }}>
          <p>{message.text}</p>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Loading candidates...</p>
        </div>
      ) : (
        <>
          <div className="management-section" style={{ marginBottom: '4rem' }}>
            <h2 className="brand-label" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--gold)' }}>New Year Princes</h2>
            {princes.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5 }}>No approved Prince candidates yet.</p>
            ) : (
              <div className="vote-card-grid">
                {princes.map((candidate, index) => (
                  <CandidateCard key={candidate.candidateId} candidate={candidate} index={index} />
                ))}
              </div>
            )}
          </div>

          <div className="management-section">
            <h2 className="brand-label" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--gold)' }}>New Year Princesses</h2>
            {princesses.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5 }}>No approved Princess candidates yet.</p>
            ) : (
              <div className="vote-card-grid">
                {princesses.map((candidate, index) => (
                  <CandidateCard key={candidate.candidateId} candidate={candidate} index={index} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default VoteBoard;
