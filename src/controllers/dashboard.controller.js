const dashboardService = require("../services/dashboard.service");
const { sendSuccess } = require("../utils/apiResponse");

const getSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();
    return sendSuccess(res, 200, "Dashboard summary fetched successfully.", summary);
  } catch (err) {
    next(err);
  }
};

const getMonthlyTrends = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    if (months < 1 || months > 24) {
      return next(require("../utils/ApiError").badRequest("months must be between 1 and 24."));
    }
    const trends = await dashboardService.getMonthlyTrends(months);
    return sendSuccess(res, 200, "Monthly trends fetched successfully.", trends);
  } catch (err) {
    next(err);
  }
};

const getCategoryBreakdown = async (req, res, next) => {
  try {
    const { type } = req.query;
    if (type && !["INCOME", "EXPENSE"].includes(type)) {
      return next(require("../utils/ApiError").badRequest("type must be INCOME or EXPENSE."));
    }
    const breakdown = await dashboardService.getCategoryBreakdown(type);
    return sendSuccess(res, 200, "Category breakdown fetched successfully.", breakdown);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getMonthlyTrends, getCategoryBreakdown };
