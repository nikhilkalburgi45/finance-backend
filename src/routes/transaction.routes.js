const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const authorize = require("../middlewares/authorize.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createTransactionSchema,
  updateTransactionSchema,
  filterTransactionSchema,
} = require("../validators/transaction.validator");

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Financial record management
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions with optional filters and pagination
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category (partial match)
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         description: Filter by date range start (ISO format)
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         description: Filter by date range end (ISO format)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [date, amount, createdAt], default: date }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: List of transactions with meta
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authorize("VIEWER", "ANALYST", "ADMIN"),
  validate(filterTransactionSchema, "query"),
  transactionController.getAllTransactions
);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a single transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction object
 *       404:
 *         description: Not found
 */
router.get("/:id", authorize("VIEWER", "ANALYST", "ADMIN"), transactionController.getTransactionById);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500.00
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-05-01"
 *               notes:
 *                 type: string
 *                 example: Monthly salary credit
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authorize("ADMIN"),
  validate(createTransactionSchema),
  transactionController.createTransaction
);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update a transaction (Admin can update any, Analyst can update own)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount: { type: number }
 *               type: { type: string, enum: [INCOME, EXPENSE] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Updated transaction
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch(
  "/:id",
  authorize("ANALYST", "ADMIN"),
  validate(updateTransactionSchema),
  transactionController.updateTransaction
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Soft-delete a transaction (Admin can delete any, Analyst can delete own)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction deleted (soft)
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete("/:id", authorize("ANALYST", "ADMIN"), transactionController.deleteTransaction);

module.exports = router;
