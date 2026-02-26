import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar        from './components/Navbar';
import PrivateRoute  from './components/PrivateRoute';

import Login         from './pages/Login';
import Register      from './pages/Register';
import Home          from './pages/Home';
import TrainResults  from './pages/TrainResults';
import BookTicket    from './pages/BookTicket';
import MyBookings    from './pages/MyBookings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AddTrain       from './pages/admin/AddTrain';
import ManageTrains   from './pages/admin/ManageTrains';
import BookingStats   from './pages/admin/BookingStats';
import AllBookings    from './pages/admin/AllBookings';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* ── Public ── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── User ── */}
          <Route path="/" element={<Home />} />
          <Route path="/trains" element={<TrainResults />} />
          <Route
            path="/book/:classId"
            element={
              <PrivateRoute role="USER">
                <BookTicket />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute role="USER">
                <MyBookings />
              </PrivateRoute>
            }
          />

          {/* ── Admin ── */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-train"
            element={
              <PrivateRoute role="ADMIN">
                <AddTrain />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage"
            element={
              <PrivateRoute role="ADMIN">
                <ManageTrains />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <PrivateRoute role="ADMIN">
                <BookingStats />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <PrivateRoute role="ADMIN">
                <AllBookings />
              </PrivateRoute>
            }
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
