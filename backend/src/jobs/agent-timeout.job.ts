import Ticket, { TicketStatus } from '../modules/ticket/ticket.model';
import { logger } from '../utils/logger';

export const handleAgentTimeouts = async (): Promise<void> => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const hangingTickets = await Ticket.find({
      status: TicketStatus.OPEN,
      confidenceScore: { $exists: false },
      createdAt: { $lt: thirtyMinutesAgo },
    });

    if (hangingTickets.length > 0) {
      logger.info(`Resolving ${hangingTickets.length} hanging agent tasks.`);
      for (const ticket of hangingTickets) {
        ticket.status = TicketStatus.WAITING_FOR_ADMIN;
        ticket.tags.push('AGENT_TIMEOUT');
        await ticket.save();
      }
    }
  } catch (error) {
    logger.error(`Agent timeout job failed: ${error}`);
  }
};
