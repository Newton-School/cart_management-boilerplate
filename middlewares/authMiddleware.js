const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const secretKey = 'NewtonContestTest';

// Middleware to authenticate users
exports.authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Missing token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
