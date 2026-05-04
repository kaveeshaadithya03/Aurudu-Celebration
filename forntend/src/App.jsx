import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import RegistrationForm from "./pages/RegistrationForm";
import CandidateForm from "./pages/CandidateForm";
import VoteBoard from "./pages/VoteBoard";
import StaffLogin from "./pages/StaffLogin";
import StaffPanel from "./pages/StaffPanel";
import CandidateDetail from "./pages/CandidateDetail";
import welcomeImg from "./images/3.jpeg";

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="welcome-modal" onClick={(e) => e.stopPropagation()}>
        <img src={welcomeImg} alt="Welcome" className="welcome-img" />
        <h2 className="page-title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Ayubowan!</h2>
        <p className="page-copy" style={{ marginBottom: '1.5rem' }}>
          Welcome to the Wasantha Muwadora 2026 Aurudu Celebration. Join us for a digital festival of tradition and joy.
        </p>
        <button className="primary" onClick={onClose} style={{ width: '100%' }}>
          Let's Begin
        </button>
      </div>
    </div>
  );
};

const FallingPetals = () => {
  return (
    <div className="petals-container">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 15 + 10}px`,
            height: `${Math.random() * 15 + 10}px`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal only on the first visit in a session
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowModal(true);
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="starfield"></div>
        <FallingPetals />
        {showModal && <WelcomeModal onClose={() => setShowModal(false)} />}
        <header className="app-header">
          <div>
            <p className="brand-label">Wasantha Muwadora</p>
            <p className="brand-subtitle">Aurudu Celebration 2026</p>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)}>
            <span />
            <span />
            <span />
          </button>
        </header>

        <nav className={`app-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Event Register
          </Link>
          <Link to="/apply" onClick={() => setMenuOpen(false)} className="pulse-btn" style={{ borderRadius: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
            </svg>
            Prince/Princess Apply
          </Link>
          <Link to="/vote" onClick={() => setMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M18 20V10"></path>
              <path d="M12 20V4"></path>
              <path d="M6 20v-6"></path>
            </svg>
            Voting Board
          </Link>
          <Link to="/staff" onClick={() => setMenuOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Staff Login
          </Link>
        </nav>

        <main className="app-main" onClick={() => setMenuOpen(false)}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/apply" element={<CandidateForm />} />
            <Route path="/vote" element={<VoteBoard />} />
            <Route path="/candidate/:id" element={<CandidateDetail />} />
            <Route path="/staff" element={<StaffLogin />} />
            <Route path="/staff/panel" element={<StaffPanel />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2026 Aurudu Celebration | Built for mobile-first entry and voting</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
