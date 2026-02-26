export default function SeatClassCard({ cls, waitingLimit, onBook }) {
  const available   = cls.totalSeats - cls.bookedSeats;
  const isWaiting   = available === 0;
  const waitingCount = cls.waitingCount || 0;
  const isFull      = isWaiting && waitingCount >= (waitingLimit || 10);

  // Determine CSS class
  const chipClass = isFull ? 'full' : isWaiting ? 'waiting' : 'available';

  return (
    <div
      className={`class-card ${chipClass}`}
      onClick={() => !isFull && onBook()}
      title={isFull ? 'No seats available' : 'Click to book'}
    >
      <h3>{cls.classType} Class</h3>
      <p className="price">₹{Number(cls.price).toLocaleString()}</p>

      {!isWaiting && (
        <p className="avail-text green">
          {available} Seat{available !== 1 ? 's' : ''} Available
        </p>
      )}

      {isWaiting && !isFull && (
        <p className="avail-text orange">
          Waiting List ({waitingCount}/{waitingLimit || 10})
        </p>
      )}

      {isFull && (
        <p className="avail-text red">Not Available</p>
      )}
    </div>
  );
}
