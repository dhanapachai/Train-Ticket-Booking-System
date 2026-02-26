const icons = {
  CONFIRMED: '✓',
  WAITING:   '⏳',
  CANCELLED: '✕',
};

export default function BookingStatusBadge({ status }) {
  return (
    <span className={`status-badge badge-${status}`}>
      {icons[status] || '?'} {status}
    </span>
  );
}
