import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { trainAPI } from '../../api/axios';

const DEFAULT_CLASSES = [
  { classType: 'UPPER',  totalSeats: '', price: '' },
  { classType: 'LOWER',  totalSeats: '', price: '' },
  { classType: 'MIDDLE', totalSeats: '', price: '' },
];

const EMPTY_FORM = {
  trainName: '', trainNumber: '', source: '', destination: '',
  departureTime: '', arrivalTime: '', journeyDate: '',
  totalSeats: '', waitingLimit: 10,
};

export default function AddTrain() {
  const navigate = useNavigate();
  const [form, setForm]         = useState(EMPTY_FORM);
  const [classes, setClasses]   = useState(DEFAULT_CLASSES.map(c => ({ ...c })));
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const updateClass = (idx, field, value) => {
    setClasses((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleSubmit = async () => {
    setError('');
    // Basic validation
    const required = ['trainName','trainNumber','source','destination','departureTime','arrivalTime','journeyDate','totalSeats'];
    for (const f of required) {
      if (!form[f]) { setError(`Please fill in: ${f}`); return; }
    }
    for (const c of classes) {
      if (!c.totalSeats || !c.price) { setError('Fill in seats and price for all classes.'); return; }
    }

    setLoading(true);
    try {
      await trainAPI.add({ ...form, classes });
      setSuccess(true);
      setForm(EMPTY_FORM);
      setClasses(DEFAULT_CLASSES.map(c => ({ ...c })));
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add train. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="success-card">
          <div className="success-icon">🚂</div>
          <h2 className="success-title">Train Added!</h2>
          <p className="success-sub">The new train has been saved successfully.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-gold" onClick={() => setSuccess(false)}>Add Another</button>
            <button className="btn btn-ghost" onClick={() => navigate('/admin/manage')}>Manage Trains</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>➕ Add New Train</h2>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back</Link>
      </div>

      <div className="card">
        {error && <div className="err-box">{error}</div>}

        {/* ── Train Details ── */}
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: 'var(--rail)' }}>Train Details</div>
        <div className="add-form-grid">
          <div className="form-group full">
            <label>Train Name</label>
            <input placeholder="e.g. Rajdhani Express" value={form.trainName} onChange={(e) => setForm({ ...form, trainName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Train Number</label>
            <input placeholder="e.g. 12301" value={form.trainNumber} onChange={(e) => setForm({ ...form, trainNumber: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Total Seats</label>
            <input type="number" placeholder="200" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Source Station</label>
            <input placeholder="Delhi" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Destination Station</label>
            <input placeholder="Mumbai" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Departure Time</label>
            <input type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Arrival Time</label>
            <input type="time" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Journey Date</label>
            <input type="date" value={form.journeyDate} onChange={(e) => setForm({ ...form, journeyDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Waiting List Limit</label>
            <input type="number" value={form.waitingLimit} onChange={(e) => setForm({ ...form, waitingLimit: e.target.value })} />
          </div>
        </div>

        {/* ── Class Configuration ── */}
        <div style={{ fontWeight: 700, fontSize: 14, margin: '20px 0 14px', color: 'var(--rail)' }}>
          Class Configuration
        </div>
        <div className="class-config-block">
          {classes.map((cls, idx) => (
            <div className="class-config-row" key={idx}>
              <div className="class-tag">{cls.classType} CLASS</div>
              <div className="add-form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Total Seats</label>
                  <input type="number" placeholder="e.g. 60" value={cls.totalSeats}
                    onChange={(e) => updateClass(idx, 'totalSeats', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Ticket Price (₹)</label>
                  <input type="number" placeholder="e.g. 1800" value={cls.price}
                    onChange={(e) => updateClass(idx, 'price', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/admin')}>Cancel</button>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner spinner-dark" /> Adding Train...</> : '🚂 Add Train'}
          </button>
        </div>
      </div>
    </div>
  );
}
