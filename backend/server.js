const mongoose = require('mongoose');

// Environment variable for your MongoDB URI
const uri = process.env.MONGODB_URI;

// Attendee Schema and Model
const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Attendee = mongoose.model('Attendee', attendeeSchema);

// Keep track of the connection status
let conn = null;

async function connectToDatabase() {
  if (conn == null) {
    conn = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    }).then(() => mongoose);

    // `await`ing connection after assigning to the `conn` variable
    // to avoid issues where multiple requests simultaneously try to connect
    await conn;
  }

  return conn;
}


// Main serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers to allow requests from your frontend domain
  // Replace '*' with your actual frontend domain in production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  await connectToDatabase(); // Ensure database connection

  const { method, url } = req;

  if (method === 'POST' && url === '/api/confirm') {
    try {
      const names = req.body.names; // Assuming the frontend sends an array of names

      if (!Array.isArray(names) || names.length === 0) {
        return res.status(400).json({ message: 'Please provide at least one name.' });
      }

      const attendeesToSave = names.map(name => ({
        name: name,
        timestamp: new Date()
      }));

      await Attendee.insertMany(attendeesToSave);

      res.status(201).json({ message: 'Presence confirmed successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (method === 'GET' && url === '/api/attendees') {
    try {
      const attendees = await Attendee.find().sort({ timestamp: -1 });
      res.status(200).json(attendees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    // Handle other methods or paths (e.g., return a 404)
    res.status(404).json({ message: 'Not Found' });
  }
}; 