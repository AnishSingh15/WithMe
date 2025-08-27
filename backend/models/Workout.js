const mongoose = require('mongoose')

const setSchema = new mongoose.Schema({
    reps: Number,
    weight: Number,
    completed: Boolean
});

const workoutExerciseSchema = new mongoose.Schema({
    exerciseName: String,
    sets: [setSchema],
    notes: String
})

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: String,
    exercises: [workoutExerciseSchema],
    completed: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);
