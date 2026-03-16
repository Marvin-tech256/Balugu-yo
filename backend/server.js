// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Balugu Yo API is running!',
    version: '1.0.0',
    status: 'OK'
  });
});

// Routes (we will add these one by one)
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/farms', require('./routes/farms'));
// app.use('/api/predictions', require('./routes/predictions'));
// app.use('/api/weather', require('./routes/weather'));
// app.use('/api/alerts', require('./routes/alerts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});