import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protects routes by role.
// Usage: <PrivateRoute role="USER">  or  <PrivateRoute role="ADMIN">
export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Wrong role → redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
