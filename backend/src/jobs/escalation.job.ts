import Ticket, { TicketStatus } from '../modules/ticket/ticket.model';
import { notifyAdminEscalation } from '../modules/notification/notification.service';
import { logger } from '../utils/logger';

export const escalateTickets = async (): Promise<void> => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const stagnantTickets = await Ticket.find({
      status: TicketStatus.OPEN,
      createdAt: { $lt: twoHoursAgo },
    });

    console.log(`[ESCALATION DEBUG] Found ${stagnantTickets.length} stagnant tickets. Query Time: ${twoHoursAgo.toISOString()}`);

    if (stagnantTickets.length > 0) {
      logger.info(`[CRON] Escalating ${stagnantTickets.length} stagnant tickets.`);
      
      for (const ticket of stagnantTickets) {
        ticket.status = TicketStatus.WAITING_FOR_ADMIN;
        ticket.tags.push('ESCALATED');
        await ticket.save();
        await notifyAdminEscalation(ticket, 'Ticket stagnant for > 2 hours');
      }
    }
  } catch (error) {
    logger.error(`[CRON ERROR] Escalation job failed: ${error}`);
  }
};
