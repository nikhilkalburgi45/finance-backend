const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).trim().required().messages({
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name cannot exceed 80 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "any.required": "Password is required.",
  }),
  role: Joi.string().valid("VIEWER", "ANALYST", "ADMIN").default("VIEWER"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

module.exports = { registerSchema, loginSchema };
