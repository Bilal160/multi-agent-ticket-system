import Ticket, { ITicket, TicketStatus } from '../ticket/ticket.model';

export const getAllTicketsForAdmin = async (): Promise<ITicket[]> => {
  return await Ticket.find().sort({ updatedAt: -1 });
};

export const approveResponse = async (ticketId: string): Promise<ITicket | null> => {
  // Logic: Change status from WAITING_FOR_ADMIN to WAITING_FOR_USER (or CLOSED if resolved)
  // In a real system, this would trigger sending the queued email.
  return await Ticket.findByIdAndUpdate(
    ticketId,
    { status: TicketStatus.WAITING_FOR_USER },
    { new: true }
  );
};

export const rejectResponse = async (ticketId: string): Promise<ITicket | null> => {
  return await Ticket.findByIdAndUpdate(
    ticketId,
    { status: TicketStatus.OPEN, assignedAgent: 'human_admin' },
    { new: true }
  );
};
