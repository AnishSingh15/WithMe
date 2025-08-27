const axios = require('axios');
const Nutrition = require('../models/Nutrition');
const User = require("../models/User")

const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

const searchFoods = async (req, res) => {
    try {
        const {query} = req.query

        if (!query){
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const response = await axios.get(`${USDA_BASE_URL}/foods/search`, {
            params: {
                query: query,
                api_key: process.env.USDA_API_KEY,
                pageSize: 20
            }
        });

       const foods = response.data.foods.map(food => ({
            fdcId: food.fdcId,
            description: food.description,
            brandName: food.brandName || null,
            ingredients: food.ingredients || null,
            servingSizes: food.foodPortions || []
        }));

        res.json({
            success: true,
            data: {
                foods: foods,
                totalResults: response.data.totalHits
            }
        })

    } catch (error) {
        console.error('USDA API Error', error.response?.data || error.message)
        res.status(500).json({ success: false, message: "Error Searching foods" });
    }
};

module.exports = {searchFoods};