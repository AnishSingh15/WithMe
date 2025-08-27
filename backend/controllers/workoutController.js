const Workout = require('../models/Workout');

const createWorkout = async (req,res) => {
    try {
        const {name, exercises} = req.body;
        const userId = req.user.id;

        const workout = new Workout({
            userId,
            name, 
            exercises
        });

        await workout.save();

        res.status(201).json({
            success: true,
            message: 'Workout created',
            data: workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error creating workout",
            error: error.message
        })
    }
}

const getUserWorkouts = async (req,res) => {
  try {
    const userId = req.user.id;

    const workouts = await Workout.find({userId}).sort({createdAt: -1})
    res.json({
        success: true,
        data: workouts
    })

  } catch (error) {
    res.status(500).json({
        success: false,
        message: "Error fetching data",
        error: error.message
    })
  }
}

const getWorkout = async (req,res) => {
   try {
    const {id} = req.params;
    const userId = req.user.id;

    const workout = await Workout.findOne({_id: id, userId});
    if(!workout) {
        return res.status(401).json({
            success: false,
            message: "Workout not found"
        })
    }

    res.json({
        success: true,
        data: workout
    })
   } catch (err){
    return res.status(500).json({
        success: false,
        message: "error loading the workout",
        error: err.message
    })
   }
}

const updateWorkout =  async (req,res) => {
    try {
        const {id} = req.params
        const userId = req.user.id
        const updates = req.body

        const workout = await Workout.findOneAndUpdate({_id: id, userId}, updates, {new: true})
        if(!workout) {
            return res.status(400).json({
                success: false,
                message: "Workout not found"
            })
        }

        res.json({
            success: true,
            message: 'workout updated successfuly',
            data: workout
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'error updating workout',
            error: err.message
        })
    }
}


const deleteWorkout = async (req,res) => {
    try { 
      const {id} = req.params;
      const userId = req.user.id;

      const workout = await Workout.findOneAndDelete({_id: id, userId});
      if(!workout) {
        return res.status(404).json({
            success: false,
            message: 'workout not found'
        });
      }

      res.json({
        success: true,
        message: 'workout deleted successfully'
      })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting workout",
            error: err.message
        })
    }
}


module.exports = { createWorkout, getUserWorkouts, getWorkout, updateWorkout, deleteWorkout};