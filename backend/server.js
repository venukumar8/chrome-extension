// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection (optional — only if you're storing data)
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/webtime-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Sample Schema (optional — only if storing data in MongoDB)
const timeSchema = new mongoose.Schema({
  hostname: String,
  classification: String,
  timeSpent: Number,
  date: { type: Date, default: Date.now }
});

const TimeEntry = mongoose.model('TimeEntry', timeSchema);

// ✅ Root Test Route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// ✅ Sample POST route to receive time tracking data
app.post('/track', async (req, res) => {
  const { hostname, classification, timeSpent } = req.body;

  try {
    const entry = new TimeEntry({ hostname, classification, timeSpent });
    await entry.save();
    res.status(201).json({ message: 'Time tracked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Sample GET route to get productivity stats
app.get('/stats', async (req, res) => {
  try {
    const entries = await TimeEntry.find({});
    const stats = { productive: 0, unproductive: 0 };

    entries.forEach(entry => {
      if (entry.classification === 'productive') {
        stats.productive += entry.timeSpent;
      } else if (entry.classification === 'unproductive') {
        stats.unproductive += entry.timeSpent;
      }
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
