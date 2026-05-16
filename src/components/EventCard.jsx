import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers } from 'react-icons/fi';

function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  const categoryColors = {
    conference: '#6366f1',
    workshop: '#8b5cf6',
    meetup: '#06b6d4',
    webinar: '#10b981',
    concert: '#f43f5e',
    sports: '#f59e0b',
    other: '#64748b'
  };

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div className="event-image">
        {event.image ? (
          <img src={event.image} alt={event.title} />
        ) : (
          <div className="event-image-placeholder">
            <span>{event.category?.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <span
          className="event-category-badge"
          style={{ backgroundColor: categoryColors[event.category] || '#64748b' }}
        >
          {event.category}
        </span>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description?.slice(0, 100)}...</p>

        <div className="event-meta">
          <span className="meta-item">
            <FiClock />
            {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="meta-item">
            <FiMapPin />
            {event.location}
          </span>
          {event.maxAttendees > 0 && (
            <span className="meta-item">
              <FiUsers />
              {event.registrationCount}/{event.maxAttendees}
            </span>
          )}
        </div>

        <div className="event-footer">
          <span className={`event-status ${isUpcoming ? 'upcoming' : 'past'}`}>
            {isUpcoming ? 'Upcoming' : 'Past'}
          </span>
          <span className="event-organizer">
            by {event.organizer?.name || 'Unknown'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
