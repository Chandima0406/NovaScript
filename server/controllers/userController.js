const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc    Register a new user
// @route   POST /api/register
// @access  Public
const registerUser = async (req, res) => {
  const { full_name, email, phone, password, confirm_password, role } = req.body;
  
  try {
    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role
    });
    
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check for user email
    const user = await User.findOne({ email });
    
    // Validate password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get user profile
// @route   GET /api/user
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('full_name email phone role');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};