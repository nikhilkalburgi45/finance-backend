const app = require("./app");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Verify DB connection before starting
    await prisma.$connect();
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`\nFinance Dashboard API running on http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api/docs\n`);
    });
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("\nDatabase disconnected. Server shutting down.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
