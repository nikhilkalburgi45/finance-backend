const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("No token provided. Please login to continue."));
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(ApiError.unauthorized("Your session has expired. Please login again."));
      }
      return next(ApiError.unauthorized("Invalid token. Please login again."));
    }

    // Fetch fresh user data to ensure account is still active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    if (!user) {
      return next(ApiError.unauthorized("User account not found."));
    }

    if (user.status === "INACTIVE") {
      return next(ApiError.forbidden("Your account has been deactivated. Please contact an admin."));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
