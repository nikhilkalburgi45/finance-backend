const prisma = require("../config/prisma");

const buildWhereClause = (filters) => {
  const where = { isDeleted: false };

  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = { contains: filters.category, mode: "insensitive" };
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  return where;
};

const findAllTransactions = async ({ page, limit, sortBy, sortOrder, ...filters }) => {
  const skip = (page - 1) * limit;
  const where = buildWhereClause(filters);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total };
};

const findTransactionById = async (id) => {
  return prisma.transaction.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

const createTransaction = async (data) => {
  return prisma.transaction.create({
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

const updateTransaction = async (id, data) => {
  return prisma.transaction.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

const softDeleteTransaction = async (id) => {
  return prisma.transaction.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

// Dashboard aggregations
const getTotalsByType = async () => {
  const result = await prisma.transaction.groupBy({
    by: ["type"],
    where: { isDeleted: false },
    _sum: { amount: true },
    _count: { id: true },
  });
  return result;
};

const getCategoryTotals = async (type) => {
  const where = { isDeleted: false };
  if (type) where.type = type;

  return prisma.transaction.groupBy({
    by: ["category", "type"],
    where,
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
  });
};

const getMonthlyTrends = async (months = 6) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  // Raw query for monthly grouping since Prisma doesn't support date_trunc natively
  const results = await prisma.$queryRaw`
    SELECT
      TO_CHAR(date, 'YYYY-MM') AS month,
      type,
      SUM(amount)::float AS total,
      COUNT(id)::int AS count
    FROM transactions
    WHERE is_deleted = false
      AND date >= ${startDate}
    GROUP BY month, type
    ORDER BY month ASC, type ASC
  `;

  return results;
};

const getRecentTransactions = async (limit = 5) => {
  return prisma.transaction.findMany({
    where: { isDeleted: false },
    take: limit,
    orderBy: { date: "desc" },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

module.exports = {
  findAllTransactions,
  findTransactionById,
  createTransaction,
  updateTransaction,
  softDeleteTransaction,
  getTotalsByType,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentTransactions,
};
