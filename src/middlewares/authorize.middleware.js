const ApiError = require("../utils/ApiError");

// Role hierarchy: ADMIN > ANALYST > VIEWER
const ROLE_LEVELS = {
  VIEWER: 1,
  ANALYST: 2,
  ADMIN: 3,
};


const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    const userRoleLevel = ROLE_LEVELS[req.user.role];
    const hasPermission = allowedRoles.some((role) => ROLE_LEVELS[role] <= userRoleLevel);

    if (!hasPermission) {
      return next(
        ApiError.forbidden(
          `Access denied. This action requires one of the following roles: ${allowedRoles.join(", ")}.`
        )
      );
    }

    next();
  };
};

module.exports = authorize;
