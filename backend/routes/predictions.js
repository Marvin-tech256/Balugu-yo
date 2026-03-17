// backend/routes/predictions.js
const express = require('express');
const router = express.Router();
const {
  addPlanting,
  getMyPlantings,
  getPrediction,
  getMyPredictions
} = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

router.post('/plant', protect, addPlanting);
router.get('/my-plantings', protect, getMyPlantings);
router.get('/my-predictions', protect, getMyPredictions);
router.get('/:planting_id', protect, getPrediction);

module.exports = router;