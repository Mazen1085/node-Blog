const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { validate, loginValidationSchema, userValidationSchema } = require('../utils/validationSchemas');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Apply validation to signup
exports.signup = [
  validate(userValidationSchema),
  async (req, res) => {
    try {
      const { name, email, password, bio } = req.body;
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'User already exists with this email' 
        });
      }
      // Create first user as admin
      const isFirstAccount = (await User.countDocuments()) === 0;
      const role = isFirstAccount ? 'admin' : 'user';
      
      const user = await User.create({ name, email, password, bio, role });
      user.password = undefined; // Remove password from response
      
      const token = signToken(user._id);
      res.status(201).json({ 
        status: 'success', 
        message: 'User created successfully',
        token, 
        data: { user } 
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
];

// Apply validation to login
exports.login = [
  validate(loginValidationSchema),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({ 
          status: 'fail', 
          message: 'Incorrect email or password' 
        });
      }
      
      user.password = undefined; // Remove password from response
      const token = signToken(user._id);
      
      res.status(200).json({ 
        status: 'success', 
        message: 'Logged in successfully',
        token, 
        data: { user } 
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
];