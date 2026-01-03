import cron from 'node-cron';
import { escalateTickets } from './escalation.job';
import { handleAgentTimeouts } from './agent-timeout.job';
import { logger } from '../utils/logger';

export const initializeJobs = (): void => {
  logger.info('[JOBS] Initializing background cron jobs...');

  cron.schedule('0 * * * *', async () => {
    logger.info('[CRON] Running escalation job...');
    await escalateTickets();
  });

  cron.schedule('*/15 * * * *', async () => {
    logger.info('[CRON] Running agent timeout job...');
    await handleAgentTimeouts();
  });
};
