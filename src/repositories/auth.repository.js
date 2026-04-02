const prisma = require("../config/prisma");

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const createUser = async (data) => {
  return prisma.user.create({
    data,
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
  });
};

module.exports = { findUserByEmail, createUser };
