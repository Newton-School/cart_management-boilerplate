const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const secretKey = 'NewtonContestTest';

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username is already taken' });
      return;
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.find();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
