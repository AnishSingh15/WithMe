const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  startRestTimer,
  getActiveTimer,
  completeRestTimer,
  getRestTimerHistory,
  getRestTimerAnalytics,
  updateRestTimer
} = require('../controllers/restTimerController');

// @route   POST /api/rest-timer/start
// @desc    Start a new rest timer
// @access  Private
router.post('/start', auth, startRestTimer);

// @route   GET /api/rest-timer/active
// @desc    Get current active rest timer
// @access  Private
router.get('/active', auth, getActiveTimer);

// @route   PUT /api/rest-timer/:timerId/complete
// @desc    Complete/stop a rest timer
// @access  Private
router.put('/:timerId/complete', auth, completeRestTimer);

// @route   PUT /api/rest-timer/:timerId
// @desc    Update rest timer duration (while active)
// @access  Private
router.put('/:timerId', auth, updateRestTimer);

// @route   GET /api/rest-timer/history
// @desc    Get rest timer history with pagination
// @access  Private
router.get('/history', auth, getRestTimerHistory);

// @route   GET /api/rest-timer/analytics
// @desc    Get rest timer analytics for an exercise
// @access  Private
router.get('/analytics', auth, getRestTimerAnalytics);

module.exports = router;
