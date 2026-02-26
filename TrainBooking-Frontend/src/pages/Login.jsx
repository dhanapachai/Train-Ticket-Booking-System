import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(
        { name: res.data.name, email: res.data.email, role: res.data.role },
        res.data.token
      );
      navigate(res.data.role === 'ADMIN' ? '/admin' : '/');
    } catch (e) {
      setError(e.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚆</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your RailBook account</p>

        <div className="api-note">
          ⚡ Connects to Spring Boot at <strong>localhost:8080</strong><br />
          Admin: <strong>admin@train.com</strong> / <strong>admin123</strong>
        </div>

        {error && <div className="err-box">{error}</div>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={handleKey}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={handleKey}
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : 'Sign In'}
        </button>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--rail)', fontWeight: 600 }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
