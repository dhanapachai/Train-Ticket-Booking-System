import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { bookingAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingStatusBadge from '../components/BookingStatusBadge';

export default function BookTicket() {
  const { classId }  = useParams();
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const { user }     = useAuth();

  const train = state?.train;
  const cls   = state?.cls;

  const [form, setForm]         = useState({ passengerName: user?.name || '', passengerAge: '' });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [booking, setBooking]   = useState(null); // confirmed booking response

  // Guard: if no state passed, redirect back
  if (!train || !cls) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">⚠️</div>
          <h3>Invalid booking link</h3>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 20 }} onClick={() => navigate('/')}>Go to Search</button>
        </div>
      </div>
    );
  }

  const handleBook = async () => {
    setError('');
    if (!form.passengerName || !form.passengerAge) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await bookingAPI.book({
        trainClassId:  parseInt(classId),
        passengerName: form.passengerName,
        passengerAge:  parseInt(form.passengerAge),
      });
      setBooking(res.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (booking) {
    const isConfirmed = booking.status === 'CONFIRMED';
    return (
      <div className="page">
        <div className="success-card">
          <div className="success-icon">{isConfirmed ? '🎫' : '⏳'}</div>
          <h2 className="success-title">
            {isConfirmed ? 'Booking Confirmed!' : 'Added to Waiting List'}
          </h2>
          <p className="success-sub">
            {isConfirmed
              ? 'Your seat has been reserved successfully.'
              : 'You will be auto-confirmed when a seat becomes available.'}
          </p>

          <div className="booking-summary">
            <div className="summary-row"><span>Train</span><strong>{train.trainName}</strong></div>
            <div className="summary-row"><span>Route</span><strong>{train.source} → {train.destination}</strong></div>
            <div className="summary-row"><span>Date</span><strong>{train.journeyDate}</strong></div>
            <div className="summary-row"><span>Class</span><strong>{cls.classType}</strong></div>
            <div className="summary-row"><span>Passenger</span><strong>{booking.passengerName}</strong></div>
            <div className="summary-row"><span>Age</span><strong>{booking.passengerAge} yrs</strong></div>
            {booking.seatNumber && <div className="summary-row"><span>Seat No.</span><strong>{booking.seatNumber}</strong></div>}
            {booking.waitingNumber && <div className="summary-row"><span>Waiting #</span><strong>WL/{booking.waitingNumber}</strong></div>}
            <div className="summary-row"><span>Status</span><BookingStatusBadge status={booking.status} /></div>
            <div className="summary-row"><span>Price</span><strong>₹{Number(cls.price).toLocaleString()}</strong></div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/my-bookings')}>
              View My Bookings
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
              Search Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Booking form ───────────────────────────────────────────────────────────
  return (
    <div className="page">
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="card">
          <h2 className="section-title">Book Your Ticket</h2>

          {/* Train summary */}
          <div className="booking-summary">
            <div className="summary-row"><span>Train</span><strong>{train.trainName} #{train.trainNumber}</strong></div>
            <div className="summary-row"><span>Route</span><strong>{train.source} → {train.destination}</strong></div>
            <div className="summary-row"><span>Date</span><strong>{train.journeyDate}</strong></div>
            <div className="summary-row"><span>Time</span><strong>{train.departureTime} → {train.arrivalTime}</strong></div>
            <div className="summary-row"><span>Class</span><strong>{cls.classType}</strong></div>
            <div className="summary-row"><span>Price</span><strong>₹{Number(cls.price).toLocaleString()}</strong></div>
          </div>

          {error && <div className="err-box">{error}</div>}

          <div className="form-group">
            <label>Passenger Name</label>
            <input
              placeholder="Full name as per ID"
              value={form.passengerName}
              onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Passenger Age</label>
            <input
              type="number"
              placeholder="e.g. 28"
              min="1" max="120"
              value={form.passengerAge}
              onChange={(e) => setForm({ ...form, passengerAge: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              className="btn btn-gold"
              style={{ flex: 2 }}
              onClick={handleBook}
              disabled={loading}
            >
              {loading ? <><span className="spinner spinner-dark" /> Booking...</> : '✔ Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
