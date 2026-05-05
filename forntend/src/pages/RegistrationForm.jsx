import { useState } from "react";
import { submitRegistration } from "../services/api.js";

const eventOptions = [
  "Traditional Dance",
  "Kotta Pora",
  "Kana Mutti",
  "Raban Geetha",
  "Lissana Gaha",
  "Art Exhibition",
  "Cultural Song"
];

const RegistrationForm = () => {
  const [form, setForm] = useState({ participantId: "", name: "", contact: "", batch: "", gender: "", events: [] });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleEvent = (item) => {
    setForm((current) => {
      const nextEvents = current.events.includes(item)
        ? current.events.filter((entry) => entry !== item)
        : [...current.events, item];
      return { ...current, events: nextEvents };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    
    if (!/^\d{10}$/.test(form.contact)) {
      setStatus({ success: false, message: "Contact number must be exactly 10 digits." });
      setLoading(false);
      return;
    }

    try {
      await submitRegistration(form);
      setStatus({ success: true, message: "Your registration has been submitted successfully!" });
      setForm({ participantId: "", name: "", contact: "", batch: "", gender: "", events: [] });
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.error || "Unable to save registration. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="form-panel">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 20C20 20 20 10 40 10C60 10 60 30 80 30C100 30 100 20 120 20" stroke="var(--gold)" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="20" cy="20" r="4" fill="var(--gold)" />
            <circle cx="60" cy="20" r="6" fill="var(--gold)" opacity="0.5" />
            <circle cx="100" cy="20" r="4" fill="var(--gold)" />
          </svg>
        </div>
        <h1 className="page-title">Event Registration</h1>
        <p className="page-copy">Join the festivities! Fill in your details and select the traditional events you wish to participate in.</p>

        <form className="input-group" onSubmit={handleSubmit}>
          <label>
            Student ID / Index
            <input
              placeholder="e.g. IT21004455"
              value={form.participantId}
              onChange={(e) => setForm({ ...form, participantId: e.target.value.toUpperCase() })}
              required
            />
          </label>
          <label>
            Full Name
            <input
              placeholder="e.g. Sahan Anjana"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Contact Number
            <input
              type="tel"
              pattern="[0-9]{10}"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="07XXXXXXXX"
              maxLength="10"
              required
            />
          </label>
          <label>
            Batch / Class
            <input
              placeholder="e.g. Y2S2 - Computing"
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              required
            />
          </label>
          <label>
            Gender
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <div style={{ marginTop: '1rem' }}>
            <p className="category-label" style={{ marginBottom: "1rem", fontSize: '0.85rem' }}>Select Events</p>
            <div className="checkbox-group">
              {eventOptions.map((item) => (
                <label key={item} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.events.includes(item)}
                    onChange={() => toggleEvent(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="primary" type="submit" disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? "Processing..." : "Submit Registration"}
          </button>
        </form>

        {status && (
          <div className="card" style={{ marginTop: "1.5rem", textAlign: 'center', borderColor: status.success ? "#2f7c43" : "#a23b3b" }}>
            <p>{status.message}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegistrationForm;
