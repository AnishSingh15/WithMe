const express = require('express');
const {searchFoods} = require('../controllers/nutritionController');
const {authenticateToken} = require('../middleware/auth');

const router = express.Router()

router.use(authenticateToken);

router.get('/search', searchFoods);

module.exports = router;