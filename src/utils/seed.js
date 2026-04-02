require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

async function seed() {
  console.log("Starting database seed...");

  // Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@finance.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const analyst = await prisma.user.create({
    data: {
      name: "Analyst User",
      email: "analyst@finance.com",
      password: hashedPassword,
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "Viewer User",
      email: "viewer@finance.com",
      password: hashedPassword,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  console.log("Users created:", { admin: admin.email, analyst: analyst.email, viewer: viewer.email });

  // Create sample transactions
  const categories = ["Salary", "Rent", "Groceries", "Utilities", "Freelance", "Entertainment", "Travel", "Healthcare"];
  const transactions = [];

  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const isIncome = i % 3 !== 0;
    const monthOffset = Math.floor(i / 5);
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffset, (i % 28) + 1);

    transactions.push({
      amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
      type: isIncome ? "INCOME" : "EXPENSE",
      category: categories[i % categories.length],
      date,
      notes: `Sample transaction ${i + 1}`,
      userId: i % 2 === 0 ? admin.id : analyst.id,
    });
  }

  await prisma.transaction.createMany({ data: transactions });

  console.log(`Created ${transactions.length} transactions.`);
  console.log("\nSeed complete! You can login with:");
  console.log("  Admin    -> admin@finance.com / password123");
  console.log("  Analyst  -> analyst@finance.com / password123");
  console.log("  Viewer   -> viewer@finance.com / password123");
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
