const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// GET /registrations - Fetch all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /registrations - Create a new registration
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  // Basic presence check before hitting Mongoose validation
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required.' });
  }

  try {
    const newReg = new Registration({ name, email, phone });
    const saved = await newReg.save();
    res.status(201).json(saved);
  } catch (err) {
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(' | ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /registrations/:id - Delete a registration
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Registration not found.' });
    }
    res.json({ message: 'Registration deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
