import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./database";
import { logger } from "./utils/logger";

// Initialize dependencies then start HTTP server
const startServer = async () => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
  });

  // Graceful shutdown for unhandled errors
  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled rejection:", reason);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception:", error);
    server.close(() => process.exit(1));
  });
};

startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
