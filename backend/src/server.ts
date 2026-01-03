import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';
import { connectDB } from './config/db';
import { initializeJobs } from './jobs/queue';

const startServer = async () => {
  try {
    await connectDB();
    initializeJobs();
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
