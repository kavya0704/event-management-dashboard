const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/registrations/:eventId — Register for event
router.post('/:eventId', auth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isRegistrationOpen) {
      return res.status(400).json({ message: 'Registration is closed' });
    }

    // Check for existing registration
    const existing = await Registration.findOne({
      event: event._id,
      user: req.user._id
    });

    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = await Registration.create({
      event: event._id,
      user: req.user._id
    });

    // Update registration count
    event.registrationCount += 1;
    await event.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('registration:new', {
        eventId: event._id,
        registrationCount: event.registrationCount,
        spotsRemaining: event.spotsRemaining
      });
    }

    res.status(201).json({ registration, event });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/registrations/:eventId — Cancel registration
router.delete('/:eventId', auth, async (req, res, next) => {
  try {
    const registration = await Registration.findOneAndDelete({
      event: req.params.eventId,
      user: req.user._id
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const event = await Event.findById(req.params.eventId);
    if (event && event.registrationCount > 0) {
      event.registrationCount -= 1;
      await event.save();
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('registration:cancelled', {
        eventId: req.params.eventId,
        registrationCount: event?.registrationCount || 0
      });
    }

    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    next(error);
  }
});

// GET /api/registrations/my — Get current user's registrations
router.get('/my', auth, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
});

// GET /api/registrations/check/:eventId — Check if user is registered
router.get('/check/:eventId', auth, async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.eventId,
      user: req.user._id
    });

    res.json({ isRegistered: !!registration });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
