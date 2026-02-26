import SeatClassCard from './SeatClassCard';

export default function TrainCard({ train, onBook }) {
  return (
    <div className="train-card">
      <div className="train-card-header">
        <div>
          <div className="train-name">{train.trainName}</div>
          <div className="train-number">#{train.trainNumber}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="train-route">
            {train.source} → {train.destination}
          </div>
          <div className="train-meta">
            🕐 {train.departureTime} → {train.arrivalTime}
            &nbsp;·&nbsp;📅 {train.journeyDate}
            &nbsp;·&nbsp;💺 {train.totalSeats} seats
          </div>
        </div>
      </div>

      {/* Seat class chips */}
      <div className="classes-row">
        {(train.classes || []).map((cls) => (
          <SeatClassCard
            key={cls.id}
            cls={cls}
            waitingLimit={train.waitingLimit}
            onBook={() => onBook(train, cls)}
          />
        ))}
      </div>
    </div>
  );
}
