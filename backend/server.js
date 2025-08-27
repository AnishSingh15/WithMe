const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const workoutRoutes = require('./routes/workoutRoutes')
const aiRoutes = require("./routes/aiRoutes")
const nutritionRoutes = require('./routes/nutritionRoutes')

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Continuing without MongoDB for now...');
        // Don't exit - continue without database for testing
    }
};

// Connect to database
connectDB();

const app = express()
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.json({message: 'Fitness API is running'})
})
app.use('/api/auth', authRoutes)
app.use("/api/workouts", workoutRoutes)
app.use("/api/ai", aiRoutes)
app.use('/api/nutrition', nutritionRoutes)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

