import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchCandidates, voteCandidate } from "../services/api.js";
import spinningImg from "../images/4.png";

const LiyawelaOrnament = ({ className, style }) => (
  <svg className={`liyawela-corner ${className}`} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 0C100 0 80 5 60 25C40 45 40 100 40 100" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M100 20C100 20 85 25 75 40C65 55 65 100 65 100" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <path d="M100 40C100 40 90 45 85 55C80 65 80 100 80 100" stroke="var(--gold)" strokeWidth="0.5" strokeLinecap="round" opacity="0.3"/>
    <circle cx="95" cy="5" r="3" fill="var(--gold)"/>
    <circle cx="85" cy="15" r="1.5" fill="var(--gold)" opacity="0.6"/>
    <path d="M80 0C80 0 75 10 65 15C55 20 40 15 40 15" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round"/>
    <path d="M70 0C70 0 68 5 60 8C52 11 45 8 45 8" stroke="var(--gold)" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const LotusOrnament = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.8">
      <path d="M50 10C55 30 75 40 50 60C25 40 45 30 50 10Z" fill="var(--gold)" />
      <path d="M50 20C65 40 85 50 50 75C15 50 35 40 50 20Z" fill="var(--accent-gold)" opacity="0.7" />
      <path d="M30 40C45 45 50 65 30 85C10 65 15 45 30 40Z" fill="var(--gold)" opacity="0.5" />
      <path d="M70 40C55 45 50 65 70 85C90 65 85 45 70 40Z" fill="var(--gold)" opacity="0.5" />
    </g>
    <circle cx="50" cy="65" r="5" fill="var(--gold)" />
  </svg>
);

const SuryaOrnament = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="rotating" transform-origin="100 100">
      {[...Array(12)].map((_, i) => (
        <path key={i} d="M100 20 L110 50 L90 50 Z" fill="var(--gold)" transform={`rotate(${i * 30} 100 100)`} opacity="0.4" />
      ))}
      {[...Array(12)].map((_, i) => (
        <path key={i} d="M100 30 L105 55 L95 55 Z" fill="var(--accent-gold)" transform={`rotate(${i * 30 + 15} 100 100)`} opacity="0.3" />
      ))}
      <circle cx="100" cy="100" r="40" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="4 4" />
    </g>
  </svg>
);

const CandidateCard = ({ candidate, index, onVote, votingEndsAt }) => (
  <Link to={`/candidate/${candidate.candidateId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <article className="vote-card">
      <div className="royal-frame-mini" style={{ position: 'relative', margin: '0 auto 1.5rem', width: 'fit-content' }}>
        <LotusOrnament className="svg-ornament" style={{ top: '-15px', left: '50%', transform: 'translateX(-50%)', width: '30px', height: '30px', opacity: 0.6 }} />
        <LiyawelaOrnament className="liyawela-top-right" style={{ width: '40px', height: '40px', opacity: 0.3 }} />
        <LiyawelaOrnament className="liyawela-bottom-left" style={{ width: '40px', height: '40px', opacity: 0.3 }} />

        <div className="profile-photo-container" style={{ position: 'relative', padding: '8px', background: 'linear-gradient(135deg, var(--gold), transparent, var(--accent-gold))', borderRadius: '20px' }}>
          {candidate.profilePhotoUrl && (
            <img
              className="profile-photo"
              src={candidate.profilePhotoUrl}
              alt={candidate.name}
              style={{ margin: 0, borderRadius: '14px', border: 'none', display: 'block' }}
            />
          )}
          <div className="rank-medal" style={{
            position: 'absolute',
            bottom: '-10px',
            right: '-10px',
            background: 'var(--gold-foil)',
            color: '#2a0d0d',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '0.9rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            border: '2px solid #2a0d0d'
          }}>
            #{index + 1}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.6rem', marginBottom: '0.2rem', color: 'var(--gold)' }}>{candidate.name}</h2>
      <p className="category-label" style={{ marginBottom: '1rem', letterSpacing: '0.15em' }}>{candidate.role} • Batch {candidate.batch}</p>

      <div className="vote-count-wrapper" style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6, display: 'block' }}>Current Standing</span>
        <div className="vote-count" style={{ fontSize: '2rem', textShadow: '0 0 10px rgba(245, 190, 126, 0.3)' }}>{candidate.votes} <span style={{ fontSize: '0.9rem', fontWeight: '400' }}>Votes</span></div>
      </div>

      <p className="page-copy" style={{ fontSize: '0.85rem', minHeight: '3em', margin: '0 0 1.5rem', opacity: 0.8 }}>
        {candidate.description || "Traditional competition participant."}
      </p>

      <button
        className="vote-button"
        type="button"
        onClick={(e) => onVote(e, candidate.candidateId)}
        disabled={Date.now() > (votingEndsAt?.getTime() || 0) || localStorage.getItem(`voted-${candidate.candidateId}`)}
        style={{
          borderRadius: '12px',
          padding: '0.8rem',
          background: localStorage.getItem(`voted-${candidate.candidateId}`) ? 'rgba(255,255,255,0.05)' : 'transparent',
          borderColor: localStorage.getItem(`voted-${candidate.candidateId}`) ? 'rgba(255,255,255,0.2)' : 'var(--gold)'
        }}
      >
        {localStorage.getItem(`voted-${candidate.candidateId}`) ? "✓ Voted" : "Cast Your Vote"}
      </button>
    </article>
  </Link>
);

const CountdownTimer = ({ timeLeft, ended }) => {
  if (ended) return <div className="status-pill" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>Voting has ended.</div>;
  if (!timeLeft) return <div className="status-pill">Awaiting the auspicious time...</div>;

  return (
    <div className="timer-display-wrap" style={{ position: 'relative', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(245, 190, 126, 0.2)' }}>
      <LotusOrnament className="svg-ornament" style={{ top: '-10px', left: '-10px', width: '25px', height: '25px', opacity: 0.4 }} />
      <LotusOrnament className="svg-ornament" style={{ bottom: '-10px', right: '-10px', width: '25px', height: '25px', opacity: 0.4, transform: 'rotate(180deg)' }} />

      <div className="timer-container" style={{ marginTop: 0 }}>
        <div className="timer-box">
          <div className="timer-value">{timeLeft.days}</div>
          <div className="timer-label">Days</div>
        </div>
        <div className="timer-separator" style={{ color: 'var(--gold)', alignSelf: 'center', opacity: 0.5 }}>•</div>
        <div className="timer-box">
          <div className="timer-value">{timeLeft.hours}</div>
          <div className="timer-label">Hours</div>
        </div>
        <div className="timer-separator" style={{ color: 'var(--gold)', alignSelf: 'center', opacity: 0.5 }}>•</div>
        <div className="timer-box">
          <div className="timer-value">{timeLeft.minutes}</div>
          <div className="timer-label">Mins</div>
        </div>
        <div className="timer-separator" style={{ color: 'var(--gold)', alignSelf: 'center', opacity: 0.5 }}>•</div>
        <div className="timer-box">
          <div className="timer-value">{timeLeft.seconds}</div>
          <div className="timer-label">Secs</div>
        </div>
      </div>
    </div>
  );
};

const VoteBoard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [votingEndsAt, setVotingEndsAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isEnded, setIsEnded] = useState(false);

  const loadCandidates = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await fetchCandidates();
      setCandidates(data.candidates || data);
      if (data.votingEndsAt) {
        setVotingEndsAt(new Date(data.votingEndsAt));
      }
    } catch (error) {
      setMessage({ type: "error", text: "Unable to load voting board." });
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  useEffect(() => {
    if (!votingEndsAt) return;
    const updateTimer = () => {
      const diff = votingEndsAt.getTime() - Date.now();
      if (diff <= 0) {
        setIsEnded(true);
        return;
      }

      setIsEnded(false);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
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
      // Refresh candidates to show updated vote counts
      await loadCandidates(false);
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

  return (
    <section>
      {/* Background Mandala (Surya) */}
      <div className="mandala-bg-fixed">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="var(--gold)" strokeWidth="0.5" className="rotating">
            {[...Array(24)].map((_, i) => (
              <path key={i} d="M100 100 L100 20 Q110 10 120 20 L100 100" transform={`rotate(${i * 15} 100 100)`} opacity="0.6" />
            ))}
            <circle cx="100" cy="100" r="40" strokeWidth="1" />
            <circle cx="100" cy="100" r="35" strokeWidth="0.5" strokeDasharray="2,2" />
          </g>
        </svg>
      </div>

      <div className="card hero-section" style={{ padding: '4rem 1rem', background: 'linear-gradient(180deg, rgba(61, 18, 18, 0.4) 0%, rgba(26, 8, 8, 0.6) 100%)' }}>
        <SuryaOrnament style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '250px', height: '250px', zIndex: 0 }} />
        <LiyawelaOrnament className="liyawela-top-right" style={{ width: '100px', height: '100px', opacity: 0.15, zIndex: 1 }} />
        <LiyawelaOrnament className="liyawela-bottom-left" style={{ width: '100px', height: '100px', opacity: 0.15, zIndex: 1 }} />

        <div className="mandala-container" style={{ width: '160px', height: '160px', marginBottom: '1.5rem', zIndex: 2 }}>
          <img src={spinningImg} alt="Ornament" className="spinning-img floating-element" style={{ filter: 'drop-shadow(0 0 30px rgba(245, 190, 126, 0.5))' }} />
        </div>

        <div style={{ zIndex: 2, position: 'relative' }}>
          <h1 className="page-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>Voting Pavilion</h1>
          <p className="hero-subtitle" style={{ letterSpacing: '0.4em' }}>Wasantha Udanaya 2026</p>
          <p className="page-copy" style={{ marginTop: '1.5rem', maxWidth: '400px', marginInline: 'auto' }}>
            Cast your vote for the most deserving candidates of the Royal Court.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <CountdownTimer timeLeft={timeLeft} ended={isEnded} />
          </div>

          <div className="hero-actions">
            <button
              className="nav-btn"
              onClick={() => document.getElementById('princes-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'rgba(245, 190, 126, 0.15)', borderColor: 'var(--gold)' }}
            >
              Prince Selection
            </button>
            <button
              className="nav-btn"
              onClick={() => document.getElementById('princesses-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'rgba(245, 190, 126, 0.15)', borderColor: 'var(--gold)' }}
            >
              Princess Selection
            </button>
          </div>
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
          <div id="princes-section" className="management-section" style={{ marginBottom: '5rem', scrollMarginTop: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, var(--gold))', opacity: 0.4 }}></div>
              <h2 className="brand-label" style={{ textAlign: 'center', fontSize: '2.5rem', margin: 0, color: 'var(--gold)' }}>New Year Princes</h2>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, var(--gold))', opacity: 0.4 }}></div>
            </div>

            {princes.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic' }}>No approved Prince candidates yet.</p>
            ) : (
              <div className="vote-card-grid">
                {princes.map((candidate, index) => (
                  <CandidateCard
                    key={candidate.candidateId}
                    candidate={candidate}
                    index={index}
                    onVote={handleVote}
                    votingEndsAt={votingEndsAt}
                  />
                ))}
              </div>
            )}
          </div>

          <div id="princesses-section" className="management-section" style={{ scrollMarginTop: '100px', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, transparent, var(--gold))', opacity: 0.4 }}></div>
              <h2 className="brand-label" style={{ textAlign: 'center', fontSize: '2.5rem', margin: 0, color: 'var(--gold)' }}>New Year Princesses</h2>
              <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to left, transparent, var(--gold))', opacity: 0.4 }}></div>
            </div>

            {princesses.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic' }}>No approved Princess candidates yet.</p>
            ) : (
              <div className="vote-card-grid">
                {princesses.map((candidate, index) => (
                  <CandidateCard
                    key={candidate.candidateId}
                    candidate={candidate}
                    index={index}
                    onVote={handleVote}
                    votingEndsAt={votingEndsAt}
                  />
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
