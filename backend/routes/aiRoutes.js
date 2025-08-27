const express = require('express');
const { getWorkoutRecommendation } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();


router.use(authenticateToken);

router.post('/workout-recommendation', getWorkoutRecommendation);

module.exports = router;