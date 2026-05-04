import { Link } from "react-router-dom";
import spinningImg from "../images/4.png";
import logoImg from "../images/logo.png";

const LiyawelaOrnament = ({ className }) => (
  <svg className={`liyawela-corner ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 0C100 0 80 5 60 25C40 45 40 100 40 100" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M100 20C100 20 85 25 75 40C65 55 65 100 65 100" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <circle cx="95" cy="5" r="3" fill="var(--gold)"/>
    <path d="M80 0C80 0 75 10 65 15C55 20 40 15 40 15" stroke="var(--gold)" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const Home = () => {
  return (
    <section className="home-container">
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

      <div className="hero-section">
        <div className="mandala-container">
          <img src={spinningImg} alt="Ornament" className="spinning-img floating-element" />
        </div>
        <div className="hero-content">
          <h1 className="page-title main-hero-title">Ayubowan</h1>
          <p className="hero-subtitle">Wasantha Udanaya 2026</p>
          <p className="page-copy hero-text" style={{ color: 'var(--text-main)', opacity: 1, fontWeight: 500 }}>
            Experience the vibrant spirit of the Bak season. A digital home for Wasantha Udanaya traditions, contests, and celebrations.
          </p>
        </div>
      </div>

      <div className="action-grid">
        <Link to="/apply" className="action-card">
          <LiyawelaOrnament className="liyawela-top-right" />
          <div className="action-card-content">
            <div className="icon-wrapper floating-element" style={{ background: 'rgba(179, 57, 57, 0.2)', borderColor: 'var(--vermillion)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
              </svg>
            </div>
            <span className="category-label" style={{ color: 'var(--vermillion)' }}>Contestants</span>
            <h3>Aurudu Kumari</h3>
            <p>Showcase the elegance of traditional Sri Lankan beauty and poise.</p>
            <span className="explore-link">Apply to Participate →</span>
          </div>
        </Link>

        <Link to="/apply" className="action-card">
          <LiyawelaOrnament className="liyawela-top-right" />
          <div className="action-card-content">
            <div className="icon-wrapper floating-element" style={{ background: 'rgba(224, 162, 78, 0.2)', borderColor: 'var(--gold)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
              </svg>
            </div>
            <span className="category-label">Contestants</span>
            <h3>Aurudu Kumara</h3>
            <p>A tribute to the grace and strength of the island's young heritage.</p>
            <span className="explore-link">Apply to Participate →</span>
          </div>
        </Link>
      </div>

      <div className="secondary-actions">
        <Link to="/vote" className="card glass-action">
          <LiyawelaOrnament className="liyawela-top-right" style={{ width: '40px', height: '40px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div className="small-icon-wrapper" style={{ background: 'rgba(241, 196, 15, 0.15)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sandalwood)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10"></path>
                  <path d="M12 20V4"></path>
                  <path d="M6 20v-6"></path>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Voting Pavilion</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>Support your favorite candidates in real-time.</p>
              </div>
            </div>
            <span className="arrow-icon">→</span>
          </div>
        </Link>

        <Link to="/register" className="card glass-action">
          <LiyawelaOrnament className="liyawela-top-right" style={{ width: '40px', height: '40px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
              <div className="small-icon-wrapper" style={{ background: 'rgba(46, 143, 75, 0.15)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e8f4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="17" y1="11" x2="23" y2="11"></line>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Event Enrollment</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>Register for traditional games and activities.</p>
              </div>
            </div>
            <span className="arrow-icon">→</span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Home;
