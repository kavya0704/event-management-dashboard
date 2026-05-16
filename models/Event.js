const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'meetup', 'webinar', 'concert', 'sports', 'other'],
    default: 'other'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  maxAttendees: {
    type: Number,
    default: 0  // 0 = unlimited
  },
  registrationCount: {
    type: Number,
    default: 0
  },
  registrationDeadline: {
    type: Date
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Virtual: check if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
  if (this.maxAttendees > 0 && this.registrationCount >= this.maxAttendees) return false;
  return this.status === 'published';
});

// Virtual: spots remaining
eventSchema.virtual('spotsRemaining').get(function() {
  if (this.maxAttendees === 0) return -1; // unlimited
  return Math.max(0, this.maxAttendees - this.registrationCount);
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
