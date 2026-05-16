import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiUsers, FiZap } from 'react-icons/fi';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Amazing <span className="gradient-text">Events</span>
          </h1>
          <p className="hero-subtitle">
            Find conferences, workshops, meetups, and more. Create and manage events
            with real-time updates and seamless registration.
          </p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary">
              Browse Events <FiArrowRight />
            </Link>
            <Link to="/register" className="btn btn-outline">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FiCalendar /></div>
            <h3>Easy Event Management</h3>
            <p>Create, edit, and manage events with an intuitive dashboard</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiUsers /></div>
            <h3>Live Registration</h3>
            <p>Real-time registration tracking with Socket.IO updates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiZap /></div>
            <h3>Instant Notifications</h3>
            <p>Get notified about events, deadlines, and updates instantly</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
