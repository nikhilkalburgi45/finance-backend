const Joi = require("joi");

const createTransactionSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required().messages({
    "number.positive": "Amount must be a positive number.",
    "any.required": "Amount is required.",
  }),
  type: Joi.string().valid("INCOME", "EXPENSE").required().messages({
    "any.only": "Type must be either INCOME or EXPENSE.",
    "any.required": "Transaction type is required.",
  }),
  category: Joi.string().min(1).max(100).trim().required().messages({
    "string.min": "Category cannot be empty.",
    "string.max": "Category cannot exceed 100 characters.",
    "any.required": "Category is required.",
  }),
  date: Joi.date().iso().required().messages({
    "date.format": "Date must be a valid ISO date format (e.g. 2024-01-15).",
    "any.required": "Date is required.",
  }),
  notes: Joi.string().max(500).allow("", null).optional().messages({
    "string.max": "Notes cannot exceed 500 characters.",
  }),
});

const updateTransactionSchema = Joi.object({
  amount: Joi.number().positive().precision(2).messages({
    "number.positive": "Amount must be a positive number.",
  }),
  type: Joi.string().valid("INCOME", "EXPENSE").messages({
    "any.only": "Type must be either INCOME or EXPENSE.",
  }),
  category: Joi.string().min(1).max(100).trim().messages({
    "string.min": "Category cannot be empty.",
    "string.max": "Category cannot exceed 100 characters.",
  }),
  date: Joi.date().iso().messages({
    "date.format": "Date must be a valid ISO date format (e.g. 2024-01-15).",
  }),
  notes: Joi.string().max(500).allow("", null).optional().messages({
    "string.max": "Notes cannot exceed 500 characters.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update.",
  });

const filterTransactionSchema = Joi.object({
  type: Joi.string().valid("INCOME", "EXPENSE").optional(),
  category: Joi.string().max(100).trim().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.min": "End date must be after start date.",
  }),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid("date", "amount", "createdAt").default("date"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

module.exports = { createTransactionSchema, updateTransactionSchema, filterTransactionSchema };
