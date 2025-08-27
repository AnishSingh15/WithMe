const express = require('express');
const {createWorkout, getUserWorkouts, getWorkout, updateWorkout, deleteWorkout} = require("../controllers/workoutController")
const {authenticateToken} = require('../middleware/auth')

const router = express.Router();

router.use(authenticateToken);

router.post('/', createWorkout);
router.get('/', getUserWorkouts);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;