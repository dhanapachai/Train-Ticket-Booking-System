import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(
        { name: res.data.name, email: res.data.email, role: res.data.role },
        res.data.token
      );
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚉</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join RailBook and start booking trains</p>

        {error && <div className="err-box">{error}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : 'Create Account'}
        </button>

        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--rail)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
