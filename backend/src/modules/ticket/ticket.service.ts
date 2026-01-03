import Ticket, { ITicket, TicketStatus } from './ticket.model';
import { processRequest } from '../../ai/orchestrator/orchestrator.graph';
import { addMessage } from '../conversation/conversation.service';
import { SenderType } from '../conversation/conversation.model';
import { notifyGuestReference } from '../notification/notification.service';
import mongoose from 'mongoose';

export const createTicket = async (data: Partial<ITicket>): Promise<ITicket> => {
  const ticket = new Ticket(data);
  let savedTicket = await ticket.save();

  try {
    await notifyGuestReference(savedTicket);
    const result = await processRequest(savedTicket.description);
    savedTicket.confidenceScore = result.confidence;
    savedTicket.tags = [result.category];

    if (result.agentResponse) {
        if (result.decision === 'AUTO_RESPOND') {
             await addMessage({
                ticketId: savedTicket._id as mongoose.Types.ObjectId,
                senderType: SenderType.AGENT,
                senderId: result.category + '_BOT',
                content: result.agentResponse.content
            });
            savedTicket.status = TicketStatus.WAITING_FOR_USER;
        } else if (result.decision === 'REQUIRE_APPROVAL') {
             await addMessage({
                ticketId: savedTicket._id as mongoose.Types.ObjectId,
                senderType: SenderType.AGENT,
                senderId: result.category + '_BOT',
                content: `[DRAFT] ${result.agentResponse.content}`
            });
            savedTicket.status = TicketStatus.WAITING_FOR_ADMIN;
        }
    } else {
        savedTicket.status = TicketStatus.OPEN;
    }

    savedTicket = await savedTicket.save();

  } catch (error) {
    console.error('AI Processing Failed:', error);
  }

  return savedTicket;
};

export const getTicketById = async (id: string): Promise<ITicket | null> => {
  return await Ticket.findById(id);
};

export const updateTicketStatus = async (
  id: string,
  status: TicketStatus
): Promise<ITicket | null> => {
  return await Ticket.findByIdAndUpdate(id, { status }, { new: true });
};

export const findTicketsByEmail = async (email: string): Promise<ITicket[]> => {
    return await Ticket.find({ guestEmail: email });
}

export const getAllTickets = async (): Promise<ITicket[]> => {
    return await Ticket.find().sort({ createdAt: -1 });
}
