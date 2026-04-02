const prisma = require("../config/prisma");

const findAllUsers = async ({ page, limit, status, role }) => {
  const skip = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
  });
};

const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
};

module.exports = { findAllUsers, findUserById, updateUser, deleteUser };
