const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: Date, default: Date.now},
    meals: [{
        foodName: { type: String, required: true },      // "Chicken breast, raw"
        fdcId: { type: String, required: true },         // USDA food ID
        amount: { type: Number, required: true },        // 200 (grams)
        servingUnit: { type: String, required: true },   // "g", "cup", "piece"
        mealType: { type: String, required: true },      // "breakfast", "lunch"
        
        // Calculated from USDA data
        calories: { type: Number, required: true },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    }],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFats: { type: Number, default: 0 },
    calorieGoal: { type: Number, default: 2000 },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Nutrition', nutritionSchema);