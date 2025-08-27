const jwt = require('jsonwebtoken');
const User = require('../models/User')

const authenticateToken = async(req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

    
    if (!token) {
      return res.status(401).json({message: "Accesss token is required"})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.userId)
    if(!user) {
        return res.status(401).json({message: "Invalid Token"})
    }

    req.user = user;
    next();

        } catch (err) {
            res.status(401).json({message: "Invalid Token"})
        }
}

module.exports = {authenticateToken};