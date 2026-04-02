const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");

const getAllUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const { status, role } = query;

  const { users, total } = await userRepository.findAllUsers({ page, limit, status, role });

  return {
    users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  return user;
};

const updateUser = async (targetId, requestingUser, updateData) => {
  const targetUser = await userRepository.findUserById(targetId);
  if (!targetUser) {
    throw ApiError.notFound("User not found.");
  }

  // Prevent an admin from accidentally deactivating themselves
  if (targetId === requestingUser.id && updateData.status === "INACTIVE") {
    throw ApiError.badRequest("You cannot deactivate your own account.");
  }

  // Only an admin can change roles to ADMIN
  if (updateData.role === "ADMIN" && requestingUser.role !== "ADMIN") {
    throw ApiError.forbidden("Only an admin can assign the ADMIN role.");
  }

  const updated = await userRepository.updateUser(targetId, updateData);
  return updated;
};

const deleteUser = async (targetId, requestingUserId) => {
  if (targetId === requestingUserId) {
    throw ApiError.badRequest("You cannot delete your own account.");
  }

  const user = await userRepository.findUserById(targetId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  await userRepository.deleteUser(targetId);
};

const getProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }
  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getProfile };
