import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiUsers, FiTrendingUp } from 'react-icons/fi';

const API = 'http://localhost:5000/api';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchRegistrations();
  }, [user]);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`${API}/registrations/my`);
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, <strong>{user.name}</strong></p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiCalendar className="stat-icon" />
          <div><h3>{registrations.length}</h3><p>My Registrations</p></div>
        </div>
        <div className="stat-card">
          <FiUsers className="stat-icon" />
          <div><h3>{user.role}</h3><p>Account Type</p></div>
        </div>
        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div><h3>{registrations.filter(r => new Date(r.event?.date) > new Date()).length}</h3><p>Upcoming Events</p></div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>My Registered Events</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : registrations.length === 0 ? (
          <div className="empty-state">
            <p>No registrations yet. <a href="/events">Browse events</a></p>
          </div>
        ) : (
          <div className="registrations-list">
            {registrations.map(reg => (
              <div key={reg._id} className="registration-item" onClick={() => navigate(`/events/${reg.event?._id}`)}>
                <div className="reg-info">
                  <h4>{reg.event?.title || 'Event'}</h4>
                  <p>{reg.event?.location} • {new Date(reg.event?.date).toLocaleDateString()}</p>
                </div>
                <span className={`reg-status ${reg.status}`}>{reg.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
