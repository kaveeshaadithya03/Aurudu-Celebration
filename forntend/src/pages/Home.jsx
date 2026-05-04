import { Link } from "react-router-dom";
import spinningImg from "../images/4.png";

const CornerOrnament = ({ className }) => (
  <svg className={`svg-ornament ${className}`} width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 20C0 8.95431 8.95431 0 20 0H100V4C100 4 60 4 40 24C20 44 20 100 20 100H0V20Z" fill="var(--gold)" />
    <circle cx="15" cy="15" r="5" fill="var(--gold)" />
  </svg>
);

const Home = () => {
  return (
    <section className="home-container">
      {/* Background Mandala */}
      <div className="mandala-bg-fixed">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="var(--gold)" strokeWidth="0.5" className="rotating">
            {[...Array(12)].map((_, i) => (
              <ellipse key={i} cx="100" cy="100" rx="80" ry="20" transform={`rotate(${i * 15} 100 100)`} />
            ))}
            <circle cx="100" cy="100" r="30" />
            <circle cx="100" cy="100" r="50" />
          </g>
        </svg>
      </div>

      <div className="hero-section">
        <div className="mandala-container">
          <img src={spinningImg} alt="Ornament" className="spinning-img rotating" />
        </div>
        <div className="hero-content">
          <h1 className="page-title main-hero-title">Ayubowan</h1>
          <p className="hero-subtitle">Sinhala & Tamil New Year 2026</p>
          <p className="page-copy hero-text">
            A celebration of tradition, grace, and joy. Join us in welcoming the season of new beginnings through our digital festival hub.
          </p>
        </div>
      </div>

      <div className="action-grid">
        <Link to="/apply" className="action-card">
          <CornerOrnament className="ornament-top-right" />
          <div className="action-card-content">
            <div className="icon-wrapper floating-element">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
              </svg>
            </div>
            <span className="category-label">Category II</span>
            <h3>Aurudu Kumari</h3>
            <p>The radiant princess of the dawn – embodying tradition and elegance.</p>
            <span className="explore-link">Apply Now →</span>
          </div>
        </Link>

        <Link to="/apply" className="action-card">
          <CornerOrnament className="ornament-top-right" />
          <div className="action-card-content">
            <div className="icon-wrapper floating-element">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
              </svg>
            </div>
            <span className="category-label">Category I</span>
            <h3>Aurudu Kumara</h3>
            <p>The young prince of the new year – poised, graceful and rooted in heritage.</p>
            <span className="explore-link">Apply Now →</span>
          </div>
        </Link>
      </div>

      <div className="secondary-actions">
        <Link to="/vote" className="card glass-action">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="small-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10"></path>
                  <path d="M12 20V4"></path>
                  <path d="M6 20v-6"></path>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Live Voting Board</h3>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Cast your vote for the Prince & Princess.</p>
              </div>
            </div>
            <span className="arrow-icon">→</span>
          </div>
        </Link>

        <Link to="/register" className="card glass-action">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="small-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="17" y1="11" x2="23" y2="11"></line>
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Event Registration</h3>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Sign up for traditional games and activities.</p>
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
