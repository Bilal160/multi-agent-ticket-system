import { sendEmail } from './email.service';
import { ITicket } from '../ticket/ticket.model';

export const notifyGuestReference = async (ticket: ITicket): Promise<void> => {
  const subject = `Ticket Received: ${ticket.subject}`;
  const body = `Thank you for your request. Your Ticket ID is ${ticket._id}. We will get back to you shortly.`;
  await sendEmail(ticket.guestEmail, subject, body);
};

export const notifyAdminEscalation = async (ticket: ITicket, reason: string): Promise<void> => {
  const subject = `Ticket Escalated: ${ticket._id}`;
  const body = `Ticket ${ticket._id} has been escalated. Reason: ${reason}. Please review immediately.`;
  await sendEmail('admin@support.com', subject, body);
};
