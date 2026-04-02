const transactionRepository = require("../repositories/transaction.repository");
const ApiError = require("../utils/ApiError");

const getAllTransactions = async (filters) => {
  const { transactions, total } = await transactionRepository.findAllTransactions(filters);

  return {
    transactions,
    meta: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
};

const getTransactionById = async (id) => {
  const transaction = await transactionRepository.findTransactionById(id);
  if (!transaction) {
    throw ApiError.notFound("Transaction not found.");
  }
  return transaction;
};

const createTransaction = async (data, userId) => {
  const transaction = await transactionRepository.createTransaction({
    ...data,
    amount: parseFloat(data.amount),
    date: new Date(data.date),
    userId,
  });
  return transaction;
};

const updateTransaction = async (id, data, requestingUser) => {
  const transaction = await transactionRepository.findTransactionById(id);
  if (!transaction) {
    throw ApiError.notFound("Transaction not found.");
  }

  // Analysts can only update their own records; admins can update any
  if (requestingUser.role !== "ADMIN" && transaction.userId !== requestingUser.id) {
    throw ApiError.forbidden("You can only update transactions that belong to you.");
  }

  const updatePayload = {};
  if (data.amount !== undefined) updatePayload.amount = parseFloat(data.amount);
  if (data.type !== undefined) updatePayload.type = data.type;
  if (data.category !== undefined) updatePayload.category = data.category;
  if (data.date !== undefined) updatePayload.date = new Date(data.date);
  if (data.notes !== undefined) updatePayload.notes = data.notes;

  const updated = await transactionRepository.updateTransaction(id, updatePayload);
  return updated;
};

const deleteTransaction = async (id, requestingUser) => {
  const transaction = await transactionRepository.findTransactionById(id);
  if (!transaction) {
    throw ApiError.notFound("Transaction not found.");
  }

  // Analysts can only soft-delete their own records; admins can delete any
  if (requestingUser.role !== "ADMIN" && transaction.userId !== requestingUser.id) {
    throw ApiError.forbidden("You can only delete transactions that belong to you.");
  }

  await transactionRepository.softDeleteTransaction(id);
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
