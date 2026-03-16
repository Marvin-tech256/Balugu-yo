// backend/routes/farms.js
const express = require('express');
const router = express.Router();
const {
  createFarm, getMyFarms, getFarm,
  getAllFarms, updateFarm, deleteFarm
} = require('../controllers/farmController');
const { protect, officerOrAdmin } = require('../middleware/auth');

// All routes are protected
router.post('/', protect, createFarm);
router.get('/my', protect, getMyFarms);
router.get('/all', protect, officerOrAdmin, getAllFarms);
router.get('/:id', protect, getFarm);
router.put('/:id', protect, updateFarm);
router.delete('/:id', protect, deleteFarm);

module.exports = router;