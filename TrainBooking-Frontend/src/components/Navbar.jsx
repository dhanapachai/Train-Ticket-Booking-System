import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">🚆 RailBook</Link>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/" className="nav-btn">Search</Link>

            {user.role === 'USER' && (
              <Link to="/my-bookings" className="nav-btn">My Bookings</Link>
            )}

            {user.role === 'ADMIN' && (
              <Link to="/admin" className="nav-btn">Admin</Link>
            )}

            <span className="nav-badge">{user.role}</span>
            <span className="nav-btn" style={{ color: '#B0BAC9' }}>
              👤 {user.name}
            </span>

            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
