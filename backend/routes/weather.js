// backend/routes/weather.js
const express = require('express');
const router = express.Router();
const { getCurrentWeather, getForecast, getWeatherImpact } = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

router.get('/current/:district', protect, getCurrentWeather);
router.get('/forecast/:district', protect, getForecast);
router.get('/impact/:district', protect, getWeatherImpact);

module.exports = router;