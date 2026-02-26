import { useLocation, useNavigate } from 'react-router-dom';
import TrainCard from '../components/TrainCard';
import { useAuth } from '../context/AuthContext';

export default function TrainResults() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const trains     = state?.trains || [];

  // Called when user clicks a class chip
  const handleBook = (train, cls) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to booking page with train + class info
    navigate(`/book/${cls.id}`, { state: { train, cls } });
  };

  if (trains.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="icon">😕</div>
          <h3>No trains found</h3>
          <p>Try different cities or dates.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          {trains.length} Train{trains.length > 1 ? 's' : ''} Found
        </h2>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          ← New Search
        </button>
      </div>

      {trains.map((train) => (
        <TrainCard key={train.id} train={train} onBook={handleBook} />
      ))}
    </div>
  );
}
