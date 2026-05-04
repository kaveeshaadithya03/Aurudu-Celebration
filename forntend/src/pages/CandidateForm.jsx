import { useState } from "react";
import { submitCandidate } from "../services/api.js";

const CandidateForm = () => {
  const [form, setForm] = useState({ candidateId: "", name: "", contact: "", batch: "", role: "Prince", age: "", description: "" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^\d{10}$/.test(form.contact)) {
      setStatus({ success: false, message: "Contact number must be exactly 10 digits." });
      return;
    }

    const age = Number(form.age);
    if (isNaN(age) || age < 15 || age > 60) {
      setStatus({ success: false, message: "Age must be between 15 and 60." });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (photo) {
      formData.append("profilePhoto", photo);
    }

    setLoading(true);
    setStatus(null);

    try {
      await submitCandidate(formData);
      setStatus({ success: true, message: "Application submitted successfully! It will appear on the voting board once approved by staff." });
      setForm({ candidateId: "", name: "", contact: "", batch: "", role: "Prince", age: "", description: "" });
      setPhoto(null);
      setPreview(null);
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.error || "Unable to submit application. Please check your details." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="form-panel">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="floating-element">
            <path d="M2 12L5 3L9 6L12 2L15 6L19 3L22 12H2Z" fill="var(--gold)" />
            <rect x="2" y="14" width="20" height="4" rx="1" fill="var(--gold)" />
            <circle cx="12" cy="16" r="1.5" fill="var(--deep-maroon)" />
          </svg>
        </div>
        <h1 className="page-title">Prince / Princess Application</h1>
        <p className="page-copy">Step into the spotlight. Submit your profile for the Aurudu Kumara/Kumariya competition.</p>

        <form className="input-group" onSubmit={handleSubmit}>
          <label>
            Index Number (Unique)
            <input
              placeholder="e.g. INDEX123"
              value={form.candidateId}
              onChange={(e) => setForm({ ...form, candidateId: e.target.value })}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label>
              Age (15-60)
              <input
                type="number"
                min="15"
                max="60"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                required
              />
            </label>
            <label>
              Role
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
                <option value="Prince">Prince</option>
                <option value="Princess">Princess</option>
              </select>
            </label>
          </div>
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
              placeholder="e.g. Y2S2 Computing"
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
              required
            />
          </label>
          <label>
            Brief Description
            <textarea
              placeholder="Tell us a bit about yourself..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              required={!photo}
            />
          </label>

          {preview && (
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <p className="category-label" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>Photo Preview</p>
              <img src={preview} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--gold)' }} />
            </div>
          )}

          <button className="primary" type="submit" disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? "Uploading..." : "Submit Application"}
          </button>
        </form>

        {status && (
          <div className="card" style={{ marginTop: '1.5rem', textAlign: 'center', borderColor: status.success ? "#2f7c43" : "#a33c3c" }}>
            <p>{status.message}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CandidateForm;
