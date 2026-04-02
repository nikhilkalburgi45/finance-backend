const transactionRepository = require("../repositories/transaction.repository");

const getSummary = async () => {
  const [typeGroups, categoryTotals, recentTransactions] = await Promise.all([
    transactionRepository.getTotalsByType(),
    transactionRepository.getCategoryTotals(),
    transactionRepository.getRecentTransactions(5),
  ]);

  // Build income / expense totals from grouped result
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  for (const group of typeGroups) {
    const amount = parseFloat(group._sum.amount || 0);
    if (group.type === "INCOME") {
      totalIncome = amount;
      incomeCount = group._count.id;
    } else {
      totalExpenses = amount;
      expenseCount = group._count.id;
    }
  }

  const netBalance = totalIncome - totalExpenses;

  // Group category totals by type for cleaner output
  const categorySummary = categoryTotals.map((c) => ({
    category: c.category,
    type: c.type,
    total: parseFloat(c._sum.amount || 0),
    count: c._count.id,
  }));

  return {
    overview: {
      totalIncome,
      totalExpenses,
      netBalance,
      transactionCounts: {
        income: incomeCount,
        expense: expenseCount,
        total: incomeCount + expenseCount,
      },
    },
    categoryBreakdown: categorySummary,
    recentActivity: recentTransactions,
  };
};

const getMonthlyTrends = async (months = 6) => {
  const raw = await transactionRepository.getMonthlyTrends(months);

  // Merge INCOME and EXPENSE rows for the same month into one object
  const trendsMap = {};

  for (const row of raw) {
    if (!trendsMap[row.month]) {
      trendsMap[row.month] = { month: row.month, income: 0, expense: 0, net: 0 };
    }

    if (row.type === "INCOME") {
      trendsMap[row.month].income = parseFloat(row.total);
    } else {
      trendsMap[row.month].expense = parseFloat(row.total);
    }
  }

  const trends = Object.values(trendsMap).map((t) => ({
    ...t,
    net: parseFloat((t.income - t.expense).toFixed(2)),
  }));

  return trends;
};

const getCategoryBreakdown = async (type) => {
  const data = await transactionRepository.getCategoryTotals(type);

  return data.map((c) => ({
    category: c.category,
    type: c.type,
    total: parseFloat(c._sum.amount || 0),
    count: c._count.id,
  }));
};

module.exports = { getSummary, getMonthlyTrends, getCategoryBreakdown };
