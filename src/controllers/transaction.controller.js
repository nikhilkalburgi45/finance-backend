const transactionService = require("../services/transaction.service");
const { sendSuccess } = require("../utils/apiResponse");

const getAllTransactions = async (req, res, next) => {
  try {
    const { transactions, meta } = await transactionService.getAllTransactions(req.query);
    return sendSuccess(res, 200, "Transactions fetched successfully.", transactions, meta);
  } catch (err) {
    next(err);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    return sendSuccess(res, 200, "Transaction fetched successfully.", transaction);
  } catch (err) {
    next(err);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body, req.user.id);
    return sendSuccess(res, 201, "Transaction created successfully.", transaction);
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body, req.user);
    return sendSuccess(res, 200, "Transaction updated successfully.", transaction);
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user);
    return sendSuccess(res, 200, "Transaction deleted successfully.", null);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
