const express = require('express');
const router = express.Router();
// Optional: Import a Contact model if you want to save to MongoDB
// const Contact = require('../models/contact.model'); 

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Simple validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // LOGIC: Save to DB or Send Email here
    console.log('New Contact Message:', req.body);

    res.status(200).json({ message: 'Message received! We will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;