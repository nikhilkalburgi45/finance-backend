const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/apiResponse");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return sendSuccess(res, 201, "Account created successfully.", user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, 200, "Login successful.", result);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "Profile fetched successfully.", req.user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
