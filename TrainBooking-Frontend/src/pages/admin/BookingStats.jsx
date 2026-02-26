import { useState, useEffect } from 'react';
import { bookingAPI } from '../../api/axios';
import { Link } from 'react-router-dom';

export default function BookingStats() {
  const [stats, setStats]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.stats()
      .then((res) => setStats(res.data))
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  const getColor = (pct) =>
    pct >= 90 ? 'var(--red)' : pct >= 60 ? 'var(--orange)' : 'var(--green)';

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
          <p style={{ marginTop: 16 }}>Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>📊 Booking Stats</h2>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back</Link>
      </div>

      {stats.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No data yet</h3>
          <p>Add trains to see booking statistics.</p>
        </div>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Train</th>
              <th>Class</th>
              <th>Total</th>
              <th>Booked</th>
              <th>Available</th>
              <th>Waiting</th>
              <th>Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => {
              const pct = s.totalSeats > 0
                ? Math.round((s.bookedSeats / s.totalSeats) * 100)
                : 0;
              return (
                <tr key={i}>
                  <td><strong>{s.trainName}</strong><br /><span style={{ fontSize: 12, color: 'var(--muted)' }}>{s.trainNumber}</span></td>
                  <td>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                      {s.classType}
                    </span>
                  </td>
                  <td>{s.totalSeats}</td>
                  <td style={{ color: 'var(--red)', fontWeight: 600 }}>{s.bookedSeats}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>{s.availableSeats}</td>
                  <td style={{ color: 'var(--orange)', fontWeight: 600 }}>{s.waitingCount}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="prog-bar">
                        <span className="prog-fill" style={{ width: `${pct}%`, background: getColor(pct) }} />
                      </div>
                      <span style={{ fontSize: 12, color: getColor(pct), fontWeight: 700 }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
