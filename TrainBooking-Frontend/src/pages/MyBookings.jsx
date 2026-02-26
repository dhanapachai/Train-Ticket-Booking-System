import { useState, useEffect } from 'react';
import { bookingAPI } from '../api/axios';
import BookingStatusBadge from '../components/BookingStatusBadge';

export default function MyBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [cancelling, setCancelling] = useState(null); // id of booking being cancelled

  useEffect(() => {
    bookingAPI.myList()
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingAPI.cancel(id);
      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b)
      );
      setCancelling(null);
    } catch (e) {
      alert(e.response?.data?.error || 'Cancellation failed.');
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
          <p style={{ marginTop: 16 }}>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="section-title">My Bookings</h2>

      {bookings.length === 0 && (
        <div className="empty-state">
          <div className="icon">🎫</div>
          <h3>No bookings yet</h3>
          <p>Search for trains and book your first ticket!</p>
        </div>
      )}

      {bookings.map((bk) => {
        const tc    = bk.trainClass;
        const train = tc?.train;

        return (
          <div className="booking-card" key={bk.id}>
            {/* Top row */}
            <div className="booking-card-top">
              <div>
                <div className="booking-card-title">{train?.trainName ?? '—'}</div>
                <div className="booking-card-meta">
                  <span>#{train?.trainNumber}</span>
                  <span>{train?.source} → {train?.destination}</span>
                  <span>{tc?.classType} Class</span>
                </div>
              </div>
              <BookingStatusBadge status={bk.status} />
            </div>

            {/* Details row */}
            <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--muted)', flexWrap: 'wrap' }}>
              <span>👤 {bk.passengerName}, {bk.passengerAge} yrs</span>
              {bk.seatNumber    && <span>💺 Seat {bk.seatNumber}</span>}
              {bk.waitingNumber && <span>⏳ WL / {bk.waitingNumber}</span>}
              {tc?.price        && <span>₹{Number(tc.price).toLocaleString()}</span>}
            </div>

            {/* Bottom row */}
            <div className="booking-card-bottom">
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                Booked: {bk.bookedAt?.replace('T', ' ').substring(0, 16)}
              </span>

              {bk.status !== 'CANCELLED' && (
                cancelling === bk.id ? (
                  <div className="del-confirm">
                    <span>Cancel this booking?</span>
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(bk.id)}>Yes, Cancel</button>
                    <button className="btn btn-ghost btn-sm"  onClick={() => setCancelling(null)}>No</button>
                  </div>
                ) : (
                  <button className="btn btn-danger btn-sm" onClick={() => setCancelling(bk.id)}>
                    Cancel Booking
                  </button>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
