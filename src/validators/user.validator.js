const Joi = require("joi");

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(80).trim().messages({
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name cannot exceed 80 characters.",
  }),
  role: Joi.string().valid("VIEWER", "ANALYST", "ADMIN").messages({
    "any.only": "Role must be one of VIEWER, ANALYST, or ADMIN.",
  }),
  status: Joi.string().valid("ACTIVE", "INACTIVE").messages({
    "any.only": "Status must be ACTIVE or INACTIVE.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field (name, role, or status) must be provided.",
  });

module.exports = { updateUserSchema };
