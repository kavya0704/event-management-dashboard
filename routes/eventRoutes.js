const express = require('express');
const Event = require('../models/Event');
const { auth, organizerOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/events — List all published events
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sort } = req.query;
    const filter = { status: 'published' };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { date: 1 }; // Default: upcoming first
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { registrationCount: -1 };

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort(sortOption);

    res.json(events);
  } catch (error) {
    next(error);
  }
});

// GET /api/events/:id — Get single event
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
});

// POST /api/events — Create event (organizer only)
router.post('/', auth, organizerOnly, async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user._id
    });

    const populated = await event.populate('organizer', 'name email');

    // Emit real-time event
    const io = req.app.get('io');
    if (io) io.emit('event:created', populated);

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
});

// PUT /api/events/:id — Update event (owner only)
router.put('/:id', auth, organizerOnly, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(event, req.body);
    await event.save();

    const populated = await event.populate('organizer', 'name email');
    const io = req.app.get('io');
    if (io) io.emit('event:updated', populated);

    res.json(populated);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/events/:id — Delete event (owner only)
router.delete('/:id', auth, organizerOnly, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    const io = req.app.get('io');
    if (io) io.emit('event:deleted', { id: req.params.id });

    res.json({ message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
