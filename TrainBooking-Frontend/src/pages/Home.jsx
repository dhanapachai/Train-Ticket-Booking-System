import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainAPI } from '../api/axios';

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ source: '', destination: '', journeyDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSearch = async () => {
    setError('');
    setLoading(true);
    try {
      // Only pass non-empty params
      const params = {};
      if (form.source)      params.source      = form.source;
      if (form.destination) params.destination = form.destination;
      if (form.journeyDate) params.journeyDate = form.journeyDate;

      const res = await trainAPI.search(params);
      // Pass results to TrainResults page via router state
      navigate('/trains', { state: { trains: res.data } });
    } catch (e) {
      setError('Search failed — make sure the backend is running at localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="page">
      {/* ── Hero Search Bar ── */}
      <div className="hero">
        <h1 className="hero-title">Find Your Train 🚆</h1>
        <p className="hero-sub">Search across all routes — live data from backend</p>

        <div className="search-grid">
          <div className="sg-field">
            <label>From</label>
            <input
              placeholder="e.g. Delhi"
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              onKeyDown={handleKey}
            />
          </div>
          <div className="sg-field">
            <label>To</label>
            <input
              placeholder="e.g. Mumbai"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              onKeyDown={handleKey}
            />
          </div>
          <div className="sg-field">
            <label>Date</label>
            <input
              type="date"
              value={form.journeyDate}
              onChange={(e) => setForm({ ...form, journeyDate: e.target.value })}
            />
          </div>
          <div className="sg-field">
            <label style={{ opacity: 0 }}>_</label>
            <button
              className="btn btn-gold"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <span className="spinner spinner-dark" /> : '🔍 Search'}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ color: '#FCD34D', marginTop: 12, fontSize: 13 }}>⚠ {error}</p>
        )}
      </div>

      {/* ── Landing hint ── */}
      <div className="empty-state">
        <div className="icon">🗺️</div>
        <h3>Where are you headed?</h3>
        <p>Enter source, destination, or a journey date and hit Search.</p>
      </div>
    </div>
  );
}
