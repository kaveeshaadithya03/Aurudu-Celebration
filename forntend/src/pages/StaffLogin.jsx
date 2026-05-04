import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { staffLogin } from "../services/api.js";
import logoImg from "../images/logo.png";

const StaffLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await staffLogin(credentials);
      window.localStorage.setItem("staffToken", response.data.token);
      navigate("/staff/panel");
    } catch (error) {
      setStatus({ success: false, message: error.response?.data?.error || "Invalid login details." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="form-panel">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src={logoImg} alt="Logo" style={{ height: '80px', width: 'auto' }} />
        </div>
        <h1 className="page-title">Staff Login</h1>
        <p className="page-copy">Use a staff account to approve or reject candidate submissions and see the full candidate list.</p>

        <form className="input-group" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
          </label>
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {status && (
          <div className="card" style={{ borderColor: "#a33c3c" }}>
            <p>{status.message}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StaffLogin;
