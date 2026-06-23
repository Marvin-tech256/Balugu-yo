const express = require('express');
const router = express.Router();
const { askAdvice, getMyAdvice, getAdviceRequests, respondToAdvice, deleteMyAdvice } = require('../controllers/adviceController');
const { protect } = require('../middleware/auth');

// Farmer routes
router.post('/ask', protect, askAdvice);
router.get('/my', protect, getMyAdvice);
router.delete('/:id', protect, deleteMyAdvice);

// Extension officer routes
router.get('/requests', protect, getAdviceRequests);
router.post('/respond', protect, respondToAdvice);

module.exports = router;
