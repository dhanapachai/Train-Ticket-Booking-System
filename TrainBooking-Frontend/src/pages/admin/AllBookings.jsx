import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../api/axios';
import BookingStatusBadge from '../../components/BookingStatusBadge';

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('ALL'); // ALL | CONFIRMED | WAITING | CANCELLED

  useEffect(() => {
    bookingAPI.all()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
          <p style={{ marginTop: 16 }}>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>📋 All Bookings</h2>
        <Link to="/admin" className="btn btn-ghost btn-sm">← Back</Link>
      </div>

      {/* Filter tabs */}
      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        {['ALL', 'CONFIRMED', 'WAITING', 'CANCELLED'].map((s) => (
          <button
            key={s}
            className={`admin-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? `All (${bookings.length})` : s}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>No bookings found</h3>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <table className="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Passenger</th>
              <th>Train</th>
              <th>Class</th>
              <th>Seat / WL</th>
              <th>Price</th>
              <th>Status</th>
              <th>Booked At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bk) => {
              const tc    = bk.trainClass;
              const train = tc?.train;
              return (
                <tr key={bk.id}>
                  <td style={{ color: 'var(--muted)', fontWeight: 600 }}>#{bk.id}</td>
                  <td>
                    <strong>{bk.passengerName}</strong>
                    <br />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{bk.user?.email}</span>
                  </td>
                  <td>
                    <strong>{train?.trainName}</strong>
                    <br />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{train?.source} → {train?.destination}</span>
                  </td>
                  <td>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                      {tc?.classType}
                    </span>
                  </td>
                  <td>
                    {bk.seatNumber
                      ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>{bk.seatNumber}</span>
                      : bk.waitingNumber
                      ? <span style={{ color: 'var(--orange)', fontWeight: 600 }}>WL/{bk.waitingNumber}</span>
                      : '—'}
                  </td>
                  <td>₹{Number(tc?.price || 0).toLocaleString()}</td>
                  <td><BookingStatusBadge status={bk.status} /></td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {bk.bookedAt?.replace('T', ' ').substring(0, 16)}
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
