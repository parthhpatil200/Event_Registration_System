const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const registrationRoutes = require('./routes/registrations');

const app = express();

const path = require("path");
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/registrations', registrationRoutes);

// Root health check
/* app.get('/', (req, res) => {
  res.send('Event Registration API is running.');
}); */

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
