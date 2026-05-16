import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiClock, FiUsers, FiArrowLeft } from 'react-icons/fi';

const API = 'http://localhost:5000/api';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
    if (user) checkRegistration();
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API}/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const res = await axios.get(`${API}/registrations/check/${id}`);
      setIsRegistered(res.data.isRegistered);
    } catch (err) { /* ignore */ }
  };

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await axios.post(`${API}/registrations/${id}`);
      setIsRegistered(true);
      setEvent(prev => ({ ...prev, registrationCount: prev.registrationCount + 1 }));
      toast.success('Registered successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleCancel = async () => {
    try {
      await axios.delete(`${API}/registrations/${id}`);
      setIsRegistered(false);
      setEvent(prev => ({ ...prev, registrationCount: Math.max(0, prev.registrationCount - 1) }));
      toast.success('Registration cancelled');
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return null;

  const eventDate = new Date(event.date);

  return (
    <div className="event-detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FiArrowLeft /> Back
      </button>

      <div className="event-detail-card">
        {event.image && (
          <div className="detail-image">
            <img src={event.image} alt={event.title} />
          </div>
        )}

        <div className="detail-content">
          <span className="detail-category">{event.category}</span>
          <h1>{event.title}</h1>

          <div className="detail-meta">
            <span><FiClock /> {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span><FiMapPin /> {event.location}</span>
            <span><FiUsers /> {event.registrationCount} registered{event.maxAttendees > 0 ? ` / ${event.maxAttendees} max` : ''}</span>
          </div>

          <p className="detail-description">{event.description}</p>

          <div className="detail-organizer">
            Organized by <strong>{event.organizer?.name}</strong>
          </div>

          <div className="detail-actions">
            {isRegistered ? (
              <button onClick={handleCancel} className="btn btn-outline">Cancel Registration</button>
            ) : (
              <button onClick={handleRegister} className="btn btn-primary">Register Now</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
