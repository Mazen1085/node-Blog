const User = require('../models/users');
const { validate, updateUserValidationSchema } = require('../utils/validationSchemas');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ 
      status: 'success', 
      results: users.length, 
      data: { users } 
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'User not found' 
      });
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Update user with validation
exports.updateUser = [
  validate(updateUserValidationSchema),
  async (req, res) => {
    try {
      // Users can only update their own account unless they're admin
      if (req.params.id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          status: 'fail', 
          message: 'You can only update your own account' 
        });
      }
      
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).select('-password');
      
      if (!user) {
        return res.status(404).json({ 
          status: 'fail', 
          message: 'User not found' 
        });
      }
      
      res.status(200).json({ 
        status: 'success', 
        message: 'User updated successfully',
        data: { user } 
      });
    } catch (error) {
      res.status(400).json({ status: 'fail', message: error.message });
    }
  }
];

exports.deleteUser = async (req, res) => {
  try {
    // Prevent users from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'You cannot delete your own account' 
      });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'User not found' 
      });
    }
    
    res.status(204).json({ 
      status: 'success', 
      message: 'User deleted successfully',
      data: null 
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};