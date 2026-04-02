const userService = require("../services/user.service");
const { sendSuccess } = require("../utils/apiResponse");

const getAllUsers = async (req, res, next) => {
  try {
    const { users, meta } = await userService.getAllUsers(req.query);
    return sendSuccess(res, 200, "Users fetched successfully.", users, meta);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, 200, "User fetched successfully.", user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.user, req.body);
    return sendSuccess(res, 200, "User updated successfully.", updated);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user.id);
    return sendSuccess(res, 200, "User deleted successfully.", null);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
