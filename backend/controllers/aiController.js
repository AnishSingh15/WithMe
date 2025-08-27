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
       Recent exercises: ${recentWorkout[0].exercises.map(ex => 
         `${ex.name} - ${ex.sets.length} sets: ${ex.sets.map(set => `${set.weight}kg x ${set.reps} reps`).join(', ')}`
       ).join('\n')}` 
       : 'No previous workouts'}
        
        PROGRESSIVE OVERLOAD ANALYSIS:
       - Analyze the workout history above for completion patterns
       - If user completed all target reps easily in recent sessions, suggest 5-10% weight increase
       - If user failed to hit target reps, maintain current weight or suggest technique focus
       - Look for strength progression trends over the last 3-5 workouts
       - Recommend deload (10-20% weight reduction) if user has been struggling for 2+ sessions
       
        REQUIREMENTS:
       - Follow your 3-day split: Chest+Triceps, Back+Biceps, Legs+Shoulders
       - Include 1-2 compound movements (3 sets)
       - Include 2 isolation exercises (3 sets)
       - Suggest specific weights based on user's size and previous performance
       - Provide detailed progressive overload recommendations with reasoning
       - Add nutrition tips for muscle building

        Provide a complete workout plan with:
        1. Exercise selection with sets/reps/weights
        2. Specific progressive overload strategy for each exercise
        3. Reasoning behind weight recommendations
        4. Next session progression plan
        5. Nutrition advice for recovery and muscle building
       
       - When suggesting weight increases, provide EXACT weights in kg (e.g., "increase from 80kg to 85kg")
       - For compound movements: suggest 2.5-5kg increases
       - For isolation exercises: suggest 1-2.5kg increases  
       - Always show current weight → recommended new weight
       - Provide SPECIFIC weight recommendations in kg, not just percentages
       - Show progression as "Current: 80kg → Next session: 85kg"
       `;

       const aiResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
            role: "system",
            content: "You are an expert fitness instructor and progressive overload specialist. Analyze workout data scientifically to provide precise weight progression recommendations. Focus on sustainable strength gains while preventing plateaus and overtraining."
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