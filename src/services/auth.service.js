const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/auth.repository");
const ApiError = require("../utils/ApiError");

const register = async ({ name, email, password, role }) => {
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

const login = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  if (user.status === "INACTIVE") {
    throw ApiError.forbidden("Your account has been deactivated. Please contact an admin.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  // Don't send the hashed password back
  const { password: _pwd, ...safeUser } = user;

  return { token, user: safeUser };
};

module.exports = { register, login };
