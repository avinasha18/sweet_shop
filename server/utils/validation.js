import Joi from 'joi';

// Auth validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required'
  })
});

// Sweet validation schemas
export const sweetSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Sweet name must be at least 2 characters long',
    'string.max': 'Sweet name cannot exceed 100 characters',
    'any.required': 'Sweet name is required'
  }),
  category: Joi.string().valid('Cakes', 'Candy', 'Cookies', 'Chocolates', 'Ice Cream', 'Pastries', 'Other').required().messages({
    'any.only': 'Category must be one of: Cakes, Candy, Cookies, Chocolates, Ice Cream, Pastries, Other',
    'any.required': 'Category is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required'
  }),
  quantity: Joi.number().min(0).default(0).messages({
    'number.min': 'Quantity cannot be negative'
  }),
  description: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description cannot exceed 500 characters',
    'any.required': 'Description is required'
  }),
  imageUrl: Joi.string().uri().optional().messages({
    'string.uri': 'Image URL must be a valid URL'
  })
});

export const sweetUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  category: Joi.string().valid('Cakes', 'Candy', 'Cookies', 'Chocolates', 'Ice Cream', 'Pastries', 'Other').optional(),
  price: Joi.number().min(0).optional(),
  quantity: Joi.number().min(0).optional(),
  description: Joi.string().min(10).max(500).optional(),
  imageUrl: Joi.string().uri().optional().allow('')
});

// Purchase validation schema
export const purchaseSchema = Joi.object({
  quantity: Joi.number().min(1).required().messages({
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required'
  })
});

// Restock validation schema
export const restockSchema = Joi.object({
  quantity: Joi.number().min(1).required().messages({
    'number.min': 'Restock quantity must be at least 1',
    'any.required': 'Restock quantity is required'
  })
});

// Query validation schemas
export const sweetsQuerySchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  sort: Joi.string().valid('name', 'price', 'createdAt', '-name', '-price', '-createdAt').default('-createdAt'),
  category: Joi.string().valid('Cakes', 'Candy', 'Cookies', 'Chocolates', 'Ice Cream', 'Pastries', 'Other').optional().allow(''),
  minPrice: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().allow('').empty('')
  ).optional(),
  maxPrice: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().allow('').empty('')
  ).optional(),
  q: Joi.string().max(100).optional().allow(''),
  search: Joi.string().max(100).optional().allow(''),
  inStock: Joi.string().valid('true', 'false').optional()
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    req.query = value; // Replace with validated and default values
    next();
  };
};
