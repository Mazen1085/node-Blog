const Joi = require('joi');

// Validate user data
const userValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email format is invalid'
  }),
  bio: Joi.string().max(500).optional().messages({
    'string.max': 'Bio must not exceed 500 characters'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters'
  }),
  role: Joi.string().valid('admin', 'user').default('user')
});

// Validate login data
const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email format is invalid'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

// Validate post data
const postValidationSchema = Joi.object({
  title: Joi.string().min(5).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title must not exceed 100 characters'
  }),
  content: Joi.string().min(10).required().messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 10 characters'
  })
});

// Validate user update data
const updateUserValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 50 characters'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email format is invalid'
  }),
  bio: Joi.string().max(500).optional().messages({
    'string.max': 'Bio must not exceed 500 characters'
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters'
  })
});

// Validation function
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Validation error',
        errors: errorMessages 
      });
    }
    next();
  };
};

module.exports = {
  userValidationSchema,
  loginValidationSchema,
  postValidationSchema,
  updateUserValidationSchema,
  validate
};