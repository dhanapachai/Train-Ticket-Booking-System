import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const tiles = [
    { icon: '📊', label: 'Booking Stats',  desc: 'View seat occupancy per train & class', to: '/admin/stats' },
    { icon: '➕', label: 'Add Train',      desc: 'Add a new train with class configuration', to: '/admin/add-train' },
    { icon: '🛤️', label: 'Manage Trains', desc: 'Edit or delete existing trains', to: '/admin/manage' },
    { icon: '📋', label: 'All Bookings',   desc: 'View all passenger bookings', to: '/admin/bookings' },
  ];

  return (
    <div className="page">
      <h2 className="section-title">Admin Dashboard</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 14 }}>
        Manage trains, view bookings, and monitor seat availability.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            style={{ textDecoration: 'none' }}
          >
            <div className="card" style={{ cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t.label}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
