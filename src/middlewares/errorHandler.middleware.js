const ApiError = require("../utils/ApiError");
const { sendError } = require("../utils/apiResponse");

// Handles Prisma-specific errors and converts them to ApiErrors
const handlePrismaError = (err) => {
  switch (err.code) {
    case "P2002": {
      const field = err.meta?.target?.[0] || "field";
      return ApiError.conflict(`A record with this ${field} already exists.`);
    }
    case "P2025":
      return ApiError.notFound("The requested record was not found.");
    case "P2003":
      return ApiError.badRequest("Related record not found. Please check the provided IDs.");
    default:
      return ApiError.internal("A database error occurred.");
  }
};

const errorHandler = (err, req, res, next) => {
  // Prisma errors have a specific shape
  if (err.code && err.code.startsWith("P")) {
    err = handlePrismaError(err);
  }

  // Operational errors are ones we threw intentionally with ApiError
  if (err instanceof ApiError && err.isOperational) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  // For unexpected errors, log and return a generic message
  console.error("Unexpected error:", err);

  return sendError(res, 500, "An unexpected error occurred. Please try again later.");
};

module.exports = errorHandler;
