import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCandidateById, voteCandidate } from "../services/api.js";

const CandidateDetail = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [rank, setRank] = useState(0);
  const [votingEndsAt, setVotingEndsAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [timerLabel, setTimerLabel] = useState("");

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        const data = await fetchCandidateById(id);
        setCandidate(data.candidate);
        setRank(data.rank);
        if (data.votingEndsAt) setVotingEndsAt(new Date(data.votingEndsAt));
      } catch (error) {
        setMessage({ type: "error", text: "Candidate not found or error loading profile." });
      } finally {
        setLoading(false);
      }
    };
    loadCandidate();
  }, [id]);

  useEffect(() => {
    if (!votingEndsAt) return;
    const updateTimer = () => {
      const diff = votingEndsAt.getTime() - Date.now();
      if (diff <= 0) {
        setTimerLabel("Voting has ended");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimerLabel(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [votingEndsAt]);

  const handleVote = async () => {
    if (localStorage.getItem(`voted-${id}`)) {
      setMessage({ type: "error", text: "You have already voted for this candidate." });
      return;
    }
    try {
      await voteCandidate(id);
      localStorage.setItem(`voted-${id}`, "true");
      setMessage({ type: "success", text: "Thank you! Your vote has been recorded." });

      // Update local state for immediate feedback
      setCandidate(prev => ({ ...prev, votes: prev.votes + 1 }));
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Vote failed." });
    }
  };

  if (loading) return <div className="app-main"><p>Loading profile...</p></div>;
  if (!candidate) return <div className="app-main"><p>Candidate not found.</p><Link to="/vote" className="primary">Back to Voting</Link></div>;

  return (
    <section className="profile-detail-container">
      <div className="royal-frame-container">
        <div className="frame-overlay">
            <div className="corner-ornament top-left"></div>
            <div className="corner-ornament top-right"></div>
            <div className="corner-ornament bottom-left"></div>
            <div className="corner-ornament bottom-right"></div>

            <div className="royal-header">
                <p>Wasantha Udanaya</p>
                <h2>2026</h2>
            </div>

            <div className="candidate-image-wrapper">
                <img src={candidate.profilePhotoUrl} alt={candidate.name} className="detail-profile-img" />
            </div>

            <div className="royal-footer">
                <div className="rank-circle">{rank}</div>
                <h3 className="candidate-name-gold">{candidate.name}</h3>
            </div>
        </div>
      </div>

      <div className="detail-info-card">
        <div className="stats-row">
            <div className="stat-pill">RANK #{rank}</div>
            <div className="stat-pill">{candidate.votes} VOTES</div>
        </div>

        <h2 className="detail-name">{candidate.name}</h2>
        <p className="detail-description">
            {candidate.description || `Ayubowan! I'm ${candidate.name}, a student from ${candidate.batch}. I'm competing for the ${candidate.role} title at this year's Wasantha Udanaya. I'd love your support!`}
        </p>

        <div className="detail-actions">
            <button
                className="primary-vote-btn"
                onClick={handleVote}
                disabled={Date.now() > (votingEndsAt?.getTime() || 0) || localStorage.getItem(`voted-${id}`)}
            >
                {Date.now() > (votingEndsAt?.getTime() || 0) ? "Voting has ended" :
                 localStorage.getItem(`voted-${id}`) ? "Voted" : "Cast Your Vote"}
            </button>

            <button className="share-btn" onClick={() => navigator.share?.({ title: `Vote for ${candidate.name}`, url: window.location.href })}>
                <span className="share-icon">📤</span> Share Profile
            </button>
        </div>

        <p className="timer-text-small">{timerLabel}</p>
      </div>

      {message && (
        <div className={`status-toast ${message.type}`}>
            {message.text}
        </div>
      )}
    </section>
  );
};

export default CandidateDetail;
