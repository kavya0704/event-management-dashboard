require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const socketHandler = require('./socket/socketHandler');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Make io accessible in controllers
app.set('io', io);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Socket handler
socketHandler(io);

// Seed data function
const seedData = async () => {
  const User = require('./models/User');
  const Event = require('./models/Event');

  const userCount = await User.countDocuments();
  if (userCount > 0) return; // Already seeded

  console.log('🌱 Seeding demo data...');

  // Create demo users
  const organizer = await User.create({
    name: 'Sarah Organizer',
    email: 'organizer@demo.com',
    password: 'password123',
    role: 'organizer'
  });

  const user = await User.create({
    name: 'Alex User',
    email: 'user@demo.com',
    password: 'password123',
    role: 'user'
  });

  // Create demo events
  const now = new Date();
  await Event.create([
    {
      title: 'Tech Innovation Summit 2026',
      description: 'Join the biggest technology conference of the year featuring keynotes from industry leaders, hands-on workshops, and networking opportunities. Explore the latest advancements in AI, cloud computing, blockchain, and quantum computing. Connect with 500+ tech professionals and entrepreneurs.',
      category: 'conference',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      location: 'Convention Center, San Francisco',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      maxAttendees: 500,
      registrationDeadline: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      organizer: organizer._id,
      registrationCount: 0,
      status: 'published'
    },
    {
      title: 'Creative Design Workshop',
      description: 'A hands-on workshop for designers of all levels. Learn modern UI/UX practices, design thinking methodologies, and prototyping techniques using the latest industry tools. Includes live critique sessions and portfolio reviews from design directors at top companies.',
      category: 'workshop',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      location: 'Design Studio, New York',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
      maxAttendees: 30,
      registrationDeadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      organizer: organizer._id,
      registrationCount: 0,
      status: 'published'
    },
    {
      title: 'Startup Founders Meetup',
      description: 'Monthly meetup for startup founders and aspiring entrepreneurs. Share experiences, get feedback on your ideas, and find potential co-founders or investors. This month\'s theme: Scaling your startup from 0 to 1. Featuring a fireside chat with YC alumni.',
      category: 'meetup',
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      location: 'WeWork, Austin',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
      maxAttendees: 50,
      registrationDeadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      organizer: organizer._id,
      registrationCount: 0,
      status: 'published'
    },
    {
      title: 'Cloud Architecture Webinar',
      description: 'Deep-dive webinar on modern cloud architecture patterns. Learn about microservices, serverless computing, container orchestration, and multi-cloud strategies. Presented by AWS-certified architects with 15+ years of experience.',
      category: 'webinar',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      location: 'Online (Zoom)',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      maxAttendees: 0,
      organizer: organizer._id,
      registrationCount: 0,
      status: 'published'
    },
    {
      title: 'Summer Music Festival',
      description: 'An unforgettable weekend of live music featuring 20+ artists across 3 stages. From indie rock to electronic, jazz to hip-hop — there\'s something for every music lover. Food trucks, art installations, and sunset sessions included.',
      category: 'concert',
      date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      location: 'Central Park, Chicago',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      maxAttendees: 2000,
      registrationDeadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      organizer: organizer._id,
      registrationCount: 0,
      status: 'published'
    },
    {
      title: 'Marathon City Run 2026',
      description: 'Annual city marathon open to runners of all experience levels. Choose from 5K, 10K, half-marathon, or full marathon routes through scenic city landmarks. Professional timing, hydration stations every 2 miles, and finisher medals for all participants.',
      category: 'sports',
      date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      location: 'Downtown, Boston',
      image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
      maxAttendees: 1000,
      registrationDeadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      organizer: organizer._id,
      registrationCount: 0,
      status: 'published'
    }
  ]);

  console.log('✅ Demo data seeded successfully');
  console.log('   📧 Organizer: organizer@demo.com / password123');
  console.log('   📧 User: user@demo.com / password123');
};

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await seedData();
  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO ready`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`);
  });
};

start();
