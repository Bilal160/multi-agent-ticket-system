import Message, { IMessage } from './conversation.model';

export const addMessage = async (data: Partial<IMessage>): Promise<IMessage> => {
  const message = new Message(data);
  return await message.save();
};

export const getMessagesByTicketId = async (ticketId: string): Promise<IMessage[]> => {
  return await Message.find({ ticketId }).sort({ createdAt: 1 });
};
