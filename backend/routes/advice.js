const express = require('express');
const router = express.Router();
const { askAdvice, getMyAdvice, getAdviceRequests, respondToAdvice } = require('../controllers/adviceController');
const { protect } = require('../middleware/auth');

// Farmer routes
router.post('/ask', protect, askAdvice);
router.get('/my', protect, getMyAdvice);

// Extension officer routes
router.get('/requests', protect, getAdviceRequests);
router.post('/respond', protect, respondToAdvice);

module.exports = router;
