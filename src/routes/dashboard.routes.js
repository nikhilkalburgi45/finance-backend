const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregated financial analytics (Analyst and Admin)
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get overall financial summary (total income, expenses, net balance, recent activity)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalIncome: { type: number }
 *                         totalExpenses: { type: number }
 *                         netBalance: { type: number }
 *                     categoryBreakdown: { type: array }
 *                     recentActivity: { type: array }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/summary", authorize("ANALYST", "ADMIN"), dashboardController.getSummary);

/**
 * @swagger
 * /dashboard/trends:
 *   get:
 *     summary: Get monthly income vs expense trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer, default: 6, minimum: 1, maximum: 24 }
 *         description: Number of past months to include
 *     responses:
 *       200:
 *         description: Monthly trends array
 *       400:
 *         description: Invalid months value
 */
router.get("/trends", authorize("ANALYST", "ADMIN"), dashboardController.getMonthlyTrends);

/**
 * @swagger
 * /dashboard/categories:
 *   get:
 *     summary: Get spending/income breakdown by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: Category breakdown
 *       400:
 *         description: Invalid type value
 */
router.get("/categories", authorize("ANALYST", "ADMIN"), dashboardController.getCategoryBreakdown);

module.exports = router;
