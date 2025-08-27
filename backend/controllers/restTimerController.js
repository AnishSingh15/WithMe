const RestTimer = require('../models/RestTimer');
const auth = require('../middleware/auth');

// Start a rest timer
const startRestTimer = async (req, res) => {
  try {
    const { exerciseName, restDuration = 90, workoutId, setNumber = 1 } = req.body;

    // Check if user already has an active timer
    const activeTimer = await RestTimer.getActiveTimer(req.user._id);
    if (activeTimer) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active rest timer. Complete it first.',
        activeTimer: {
          id: activeTimer._id,
          exerciseName: activeTimer.exerciseName,
          timeRemaining: activeTimer.timeRemaining,
          timeElapsed: activeTimer.timeElapsed
        }
      });
    }

    const restTimer = new RestTimer({
      userId: req.user._id,
      exerciseName,
      restDuration,
      workoutId,
      setNumber,
      startTime: new Date()
    });

    await restTimer.save();

    res.status(201).json({
      success: true,
      message: 'Rest timer started successfully',
      data: {
        id: restTimer._id,
        exerciseName: restTimer.exerciseName,
        restDuration: restTimer.restDuration,
        timeRemaining: restTimer.timeRemaining,
        startTime: restTimer.startTime,
        setNumber: restTimer.setNumber
      }
    });
  } catch (error) {
    console.error('Start rest timer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting rest timer',
      error: error.message
    });
  }
};

// Get current active timer status
const getActiveTimer = async (req, res) => {
  try {
    const activeTimer = await RestTimer.getActiveTimer(req.user._id);
    
    if (!activeTimer) {
      return res.status(200).json({
        success: true,
        message: 'No active rest timer found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Active rest timer found',
      data: {
        id: activeTimer._id,
        exerciseName: activeTimer.exerciseName,
        restDuration: activeTimer.restDuration,
        timeRemaining: activeTimer.timeRemaining,
        timeElapsed: activeTimer.timeElapsed,
        startTime: activeTimer.startTime,
        setNumber: activeTimer.setNumber,
        workoutId: activeTimer.workoutId
      }
    });
  } catch (error) {
    console.error('Get active timer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting active timer',
      error: error.message
    });
  }
};

// Complete/Stop rest timer
const completeRestTimer = async (req, res) => {
  try {
    const { timerId } = req.params;
    
    const restTimer = await RestTimer.findOne({ 
      _id: timerId, 
      userId: req.user._id, 
      isActive: true 
    });

    if (!restTimer) {
      return res.status(404).json({
        success: false,
        message: 'Active rest timer not found'
      });
    }

    await restTimer.complete();

    const actualRestTime = Math.floor((restTimer.endTime - restTimer.startTime) / 1000);

    res.status(200).json({
      success: true,
      message: 'Rest timer completed successfully',
      data: {
        id: restTimer._id,
        exerciseName: restTimer.exerciseName,
        plannedDuration: restTimer.restDuration,
        actualDuration: actualRestTime,
        startTime: restTimer.startTime,
        endTime: restTimer.endTime,
        efficiency: Math.round((restTimer.restDuration / actualRestTime) * 100)
      }
    });
  } catch (error) {
    console.error('Complete rest timer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing rest timer',
      error: error.message
    });
  }
};

// Get rest timer history
const getRestTimerHistory = async (req, res) => {
  try {
    const { exerciseName, limit = 10, page = 1 } = req.query;
    
    const query = { 
      userId: req.user._id, 
      isActive: false,
      endTime: { $exists: true }
    };
    
    if (exerciseName) {
      query.exerciseName = new RegExp(exerciseName, 'i');
    }

    const restTimers = await RestTimer.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('workoutId', 'name date');

    const total = await RestTimer.countDocuments(query);

    const historyWithStats = restTimers.map(timer => {
      const actualDuration = timer.endTime ? 
        Math.floor((timer.endTime - timer.startTime) / 1000) : 
        timer.restDuration;
      
      return {
        id: timer._id,
        exerciseName: timer.exerciseName,
        plannedDuration: timer.restDuration,
        actualDuration,
        efficiency: Math.round((timer.restDuration / actualDuration) * 100),
        startTime: timer.startTime,
        endTime: timer.endTime,
        setNumber: timer.setNumber,
        workout: timer.workoutId,
        createdAt: timer.createdAt
      };
    });

    res.status(200).json({
      success: true,
      message: 'Rest timer history retrieved successfully',
      data: {
        timers: historyWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalTimers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get rest timer history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting rest timer history',
      error: error.message
    });
  }
};

// Get rest timer analytics
const getRestTimerAnalytics = async (req, res) => {
  try {
    const { exerciseName } = req.query;
    
    if (!exerciseName) {
      return res.status(400).json({
        success: false,
        message: 'Exercise name is required for analytics'
      });
    }

    const analytics = await RestTimer.getAverageRestTime(req.user._id, exerciseName);
    
    if (!analytics || analytics.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No rest timer data found for this exercise',
        data: {
          exerciseName,
          averageRestTime: null,
          minRestTime: null,
          maxRestTime: null,
          totalSessions: 0,
          recommendation: 'Start tracking your rest times to get personalized recommendations!'
        }
      });
    }

    const stats = analytics[0];
    let recommendation = '';
    
    if (stats.averageRestTime < 60) {
      recommendation = 'You might be rushing your rest periods. Consider resting longer for better recovery.';
    } else if (stats.averageRestTime > 180) {
      recommendation = 'Your rest periods are quite long. You might be able to maintain intensity with shorter rests.';
    } else {
      recommendation = 'Your rest periods look optimal for strength training. Keep it up!';
    }

    res.status(200).json({
      success: true,
      message: 'Rest timer analytics retrieved successfully',
      data: {
        exerciseName,
        averageRestTime: Math.round(stats.averageRestTime),
        minRestTime: Math.round(stats.minRestTime),
        maxRestTime: Math.round(stats.maxRestTime),
        totalSessions: stats.totalSessions,
        recommendation,
        consistency: stats.maxRestTime - stats.minRestTime < 60 ? 'High' : 
                    stats.maxRestTime - stats.minRestTime < 120 ? 'Medium' : 'Low'
      }
    });
  } catch (error) {
    console.error('Get rest timer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting rest timer analytics',
      error: error.message
    });
  }
};

// Update rest timer duration (while active)
const updateRestTimer = async (req, res) => {
  try {
    const { timerId } = req.params;
    const { restDuration } = req.body;

    const restTimer = await RestTimer.findOne({ 
      _id: timerId, 
      userId: req.user._id, 
      isActive: true 
    });

    if (!restTimer) {
      return res.status(404).json({
        success: false,
        message: 'Active rest timer not found'
      });
    }

    restTimer.restDuration = restDuration;
    await restTimer.save();

    res.status(200).json({
      success: true,
      message: 'Rest timer updated successfully',
      data: {
        id: restTimer._id,
        exerciseName: restTimer.exerciseName,
        restDuration: restTimer.restDuration,
        timeRemaining: restTimer.timeRemaining,
        timeElapsed: restTimer.timeElapsed
      }
    });
  } catch (error) {
    console.error('Update rest timer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating rest timer',
      error: error.message
    });
  }
};

module.exports = {
  startRestTimer,
  getActiveTimer,
  completeRestTimer,
  getRestTimerHistory,
  getRestTimerAnalytics,
  updateRestTimer
};
