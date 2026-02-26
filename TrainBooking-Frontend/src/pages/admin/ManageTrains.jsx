import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainAPI } from '../../api/axios';

// ── Inline Edit Modal ──────────────────────────────────────────────────────
function EditModal({ train, onSave, onClose }) {
  const [form, setForm]     = useState({ ...train });
  const [classes, setClasses] = useState((train.classes || []).map(c => ({ ...c })));
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const updateClass = (idx, field, val) =>
    setClasses((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const res = await trainAPI.update(form.id, { ...form, classes });
      onSave(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">✏️ Edit Train</h2>
        <p className="modal-sub">Update train details and class prices</p>

        {error && <div className="err-box">{error}</div>}

        {/* Train fields */}
        <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Train Details</div>
          <div className="add-form-grid">
            <div className="form-group full"><label>Train Name</label><input value={form.trainName} onChange={(e) => setForm({ ...form, trainName: e.target.value })} /></div>
            <div className="form-group"><label>Train Number</label><input value={form.trainNumber} onChange={(e) => setForm({ ...form, trainNumber: e.target.value })} /></div>
            <div className="form-group"><label>Total Seats</label><input type="number" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} /></div>
            <div className="form-group"><label>Source</label><input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div>
            <div className="form-group"><label>Destination</label><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
            <div className="form-group"><label>Departure Time</label><input type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} /></div>
            <div className="form-group"><label>Arrival Time</label><input type="time" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} /></div>
            <div className="form-group"><label>Journey Date</label><input type="date" value={form.journeyDate} onChange={(e) => setForm({ ...form, journeyDate: e.target.value })} /></div>
            <div className="form-group"><label>Waiting Limit</label><input type="number" value={form.waitingLimit} onChange={(e) => setForm({ ...form, waitingLimit: e.target.value })} /></div>
          </div>
        </div>

        {/* Class config */}
        {classes.length > 0 && (
          <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Class Configuration</div>
            {classes.map((cls, idx) => (
              <div className="class-config-row" key={cls.id || idx}>
                <div className="class-tag">{cls.classType}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}><label>Total Seats</label><input type="number" value={cls.totalSeats} onChange={(e) => updateClass(idx, 'totalSeats', e.target.value)} /></div>
                  <div className="form-group" style={{ marginBottom: 0 }}><label>Booked Seats</label><input type="number" value={cls.bookedSeats} onChange={(e) => updateClass(idx, 'bookedSeats', e.target.value)} /></div>
                  <div className="form-group" style={{ marginBottom: 0 }}><label>Price (₹)</label><input type="number" value={cls.price} onChange={(e) => updateClass(idx, 'price', e.target.value)} /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner spinner-dark" /> Saving...</> : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ManageTrains page ──────────────────────────────────────────────────────
export default function ManageTrains() {
  const [trains, setTrains]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [toast, setToast]       = useState('');

  useEffect(() => {
    trainAPI.getAll()
      .then((res) => setTrains(res.data))
      .catch(() => setTrains([]))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = (updated) => {
    setTrains((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    setEditing(null);
    showToast('Train updated successfully!');
  };

  const handleDelete = async (id) => {
    try {
      await trainAPI.delete(id);
      setTrains((prev) => prev.filter((t) => t.id !== id));
      setDelConfirm(null);
      showToast('Train deleted.');
    } catch (e) {
      alert(e.response?.data?.error || 'Delete failed.');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
          <p style={{ marginTop: 16 }}>Loading trains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>🛤️ Manage Trains</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/add-train" className="btn btn-gold btn-sm">+ Add Train</Link>
          <Link to="/admin" className="btn btn-ghost btn-sm">← Back</Link>
        </div>
      </div>

      {trains.length === 0 && (
        <div className="empty-state">
          <div className="icon">🚂</div>
          <h3>No trains found</h3>
          <p>Add your first train to get started.</p>
          <Link to="/admin/add-train" className="btn btn-gold" style={{ marginTop: 20 }}>Add Train</Link>
        </div>
      )}

      {trains.map((t) => (
        <div className="train-card" key={t.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            {/* Info */}
            <div>
              <div className="train-name">
                {t.trainName}
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)', marginLeft: 8 }}>
                  #{t.trainNumber}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>📍 {t.source} → {t.destination}</span>
                <span>📅 {t.journeyDate}</span>
                <span>🕐 {t.departureTime} – {t.arrivalTime}</span>
                <span>💺 {t.totalSeats} seats · WL limit: {t.waitingLimit}</span>
              </div>

              {/* Class chips */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {(t.classes || []).map((cls) => (
                  <span key={cls.id} style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 6 }}>
                    {cls.classType} · ₹{Number(cls.price).toLocaleString()} · {cls.totalSeats - cls.bookedSeats} avail
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(t)}>✏️ Edit</button>

              {delConfirm === t.id ? (
                <div className="del-confirm">
                  <span>Delete this train?</span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Yes</button>
                  <button className="btn btn-ghost btn-sm"  onClick={() => setDelConfirm(null)}>No</button>
                </div>
              ) : (
                <button className="btn btn-danger btn-sm" onClick={() => setDelConfirm(t.id)}>🗑 Delete</button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Edit modal */}
      {editing && (
        <EditModal
          train={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Toast */}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}
