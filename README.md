<div align="center">

# ⚡ EventHub — Event Management Dashboard

### Discover, Create, and Manage Amazing Events

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-In_Memory-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real_Time-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*A full-stack event management platform with real-time updates, user authentication, and event registration.*

</div>

---

## What is EventHub?

**EventHub** is a full-stack web application for browsing, creating, and managing events. It features **real-time registration updates** via Socket.IO, **JWT authentication** with role-based access, and a beautiful dark-themed UI.

**Zero external database required** — uses MongoDB in-memory for instant setup.

---

## Key Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login/register with role-based access (user/organizer) |
| 📅 **Event Management** | Create, edit, delete events with categories and images |
| ✅ **Event Registration** | Register/cancel for events with capacity tracking |
| ⚡ **Real-Time Updates** | Socket.IO broadcasts registration changes instantly |
| 🔍 **Search & Filter** | Filter events by category, search by keyword |
| 📊 **User Dashboard** | View registrations, stats, and upcoming events |
| 🌙 **Dark Theme** | Premium dark UI with glassmorphism effects |
| 🎯 **Demo Data** | Auto-seeds 6 events and 2 demo users on first run |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (in-memory via mongodb-memory-server) |
| **Real-Time** | Socket.IO (server + client) |
| **Auth** | JWT + bcryptjs |
| **Styling** | Vanilla CSS with custom dark theme |
| **Notifications** | react-hot-toast |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              React Frontend (Vite)           │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Pages   │ │Components│ │ Auth Context  │  │
│  │ Home     │ │ Navbar   │ │ JWT Storage   │  │
│  │ Events   │ │ EventCard│ │ Login/Logout  │  │
│  │ Detail   │ │          │ │              │  │
│  │ Dashboard│ │          │ │              │  │
│  │ Login    │ │          │ │              │  │
│  └────┬─────┘ └──────────┘ └──────────────┘  │
│       │  Axios HTTP + Socket.IO Client       │
└───────┼──────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│           Express.js Backend                 │
│  ┌──────────┐ ┌────────────┐ ┌───────────┐  │
│  │  Routes   │ │ Middleware  │ │ Socket.IO │  │
│  │ /auth     │ │ JWT Auth    │ │ Handler   │  │
│  │ /events   │ │ Error       │ │ Rooms     │  │
│  │ /register │ │ CORS        │ │ Broadcast │  │
│  │ /notify   │ │             │ │           │  │
│  └────┬──────┘ └─────────────┘ └───────────┘  │
│       │                                       │
│  ┌────▼──────────────────────────────────┐   │
│  │  Mongoose Models                       │   │
│  │  User | Event | Registration           │   │
│  └────┬──────────────────────────────────┘   │
└───────┼──────────────────────────────────────┘
        │
        ▼
┌─────────────────────┐
│  MongoDB In-Memory   │
│  (No setup needed)   │
└─────────────────────┘
```

---

## Project Structure

```
event-management-dashboard/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html                    # Vite entry
├── server.js                     # Express server + seed data
│
├── config/
│   └── db.js                     # MongoDB in-memory connection
│
├── models/
│   ├── User.js                   # User schema (bcrypt hashing)
│   ├── Event.js                  # Event schema (categories, virtuals)
│   └── Registration.js           # Registration schema (unique index)
│
├── routes/
│   ├── authRoutes.js             # Login, Register, Get Me
│   ├── eventRoutes.js            # CRUD + Socket.IO events
│   ├── registrationRoutes.js     # Register, Cancel, Check, List
│   └── notificationRoutes.js     # In-memory notifications
│
├── middleware/
│   ├── auth.js                   # JWT verification + role check
│   └── errorHandler.js           # Mongoose/JWT error formatting
│
├── socket/
│   └── socketHandler.js          # Socket.IO room management
│
└── src/                          # React Frontend
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Router + Auth Provider
    ├── context/
    │   └── AuthContext.jsx       # JWT auth state management
    ├── components/
    │   ├── Navbar.jsx            # Navigation with auth state
    │   └── EventCard.jsx         # Event listing card
    ├── pages/
    │   ├── Home.jsx              # Hero + features
    │   ├── Events.jsx            # Browse + search + filter
    │   ├── EventDetail.jsx       # Detail + register/cancel
    │   ├── Login.jsx             # Login form
    │   ├── Register.jsx          # Registration form
    │   └── Dashboard.jsx         # User stats + registrations
    └── styles/
        └── index.css             # Dark theme CSS
```

---

## Installation

### Prerequisites
- **Node.js 18+** — [Download](https://nodejs.org)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/kavya0704/event-management-dashboard.git
cd event-management-dashboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set your JWT_SECRET

# 4. Start the backend server
node server.js

# 5. In a new terminal, start the frontend
npm run dev
```

### Access

| Service | URL |
|---|---|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5000 |
| **Health Check** | http://localhost:5000/api/health |

---

## Demo Accounts

The server auto-seeds demo data on first run:

| Role | Email | Password |
|---|---|---|
| **Organizer** | organizer@demo.com | password123 |
| **User** | user@demo.com | password123 |

6 demo events are created across categories: Conference, Workshop, Meetup, Webinar, Concert, Sports.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user (auth) |

### Events
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | List events (filter by category, search) |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (organizer) |
| PUT | `/api/events/:id` | Update event (owner) |
| DELETE | `/api/events/:id` | Delete event (owner) |

### Registrations
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/registrations/:eventId` | Register for event |
| DELETE | `/api/registrations/:eventId` | Cancel registration |
| GET | `/api/registrations/my` | My registrations |
| GET | `/api/registrations/check/:eventId` | Check if registered |

---

## Future Roadmap

- [ ] Email notifications for event updates
- [ ] Calendar view for events
- [ ] Image upload (Cloudinary/S3)
- [ ] Admin panel for user management
- [ ] Event analytics dashboard for organizers
- [ ] Payment integration for paid events
- [ ] PWA support for mobile

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with React + Node.js** | **Made by [Kavya](https://github.com/kavya0704)**

</div>
