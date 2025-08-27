const OpenAI = require('openai');
const User = require("../models/User");
const Workout = require("../models/Workout")

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getWorkoutRecommendation = async (req,res) => {
    try {
        const userId = req.user.id
        const userData = await User.findById(userId)
        const recentWorkout = await Workout.find({userId: userId}).sort({createdAt: -1}).limit(5)


       const aiPrompt = `Your are an unbiased truthfull scientific fitness instructor. Create a workout recommendation for:
        USER PROFILE:
        - Name: ${userData.name}
        - Height: ${userData.height || 'not specified'}cm
        - Weight: ${userData.weight || 'not specified'}kg
        - Fitness Goal: ${userData.fitnessGoal || 'general_fitness'}
        - Activity Level: ${userData.goals?.activityLevel || 'moderate'}

        WORKOUT HISTORY:
       ${recentWorkout.length > 0 ? 
       `Last workout: ${recentWorkout[0].name} on ${recentWorkout[0].createdAt}
       Recent exercises: ${recentWorkout[0].exercises.map(ex => ex.name).join(', ')}` 
       : 'No previous workouts'}
        REQUIREMENTS:
       - Follow your 3-day split: Chest+Triceps, Back+Biceps, Legs+Shoulders
       - Include 1-2 compound movements (3 sets)
       - Include 2 isolation exercises (3 sets)
       - Suggest specific weights based on user's size and experience
       - Include progressive overload recommendations
       - Add nutrition tips for muscle building

        Provide a complete workout plan with exercises, sets, reps, weights, and nutrition advice.
       
       `;

       const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
            role: "system",
            content: "You are an expert fitness instructor who creates personalized workout plans."
            },
            {
                role: 'user',
                content: aiPrompt
            }
        ],
        temperature: 0.7,
        max_tokens: 1000
       })
       const recommendation = aiResponse.choices[0].message.content;

       res.json({
        success: true,
        user: userData.name,
        workoutCount: recentWorkout.length,
        aiRecommendation: recommendation
       })
    } catch (err) {
        res.status(500).json({success: false, message: err.message})
    }
}

module.exports = {
    getWorkoutRecommendation
};