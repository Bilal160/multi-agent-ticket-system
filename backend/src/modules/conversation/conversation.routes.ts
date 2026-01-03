import { Router, Request, Response, NextFunction } from 'express';
import * as conversationService from './conversation.service';
import mongoose from 'mongoose';

const router = Router({ mergeParams: true }); // Enable access to parent params (ticketId) if nested, but here we might just pass ticketId in body or route

// POST /api/conversations/tickets/:ticketId/messages
router.post('/tickets/:ticketId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId } = req.params;
    const { content, senderType, senderId } = req.body;
    
    const message = await conversationService.addMessage({
      ticketId: new mongoose.Types.ObjectId(ticketId),
      content,
      senderType,
      senderId
    });
    
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

// GET /api/conversations/tickets/:ticketId/messages
router.get('/tickets/:ticketId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId } = req.params;
    const messages = await conversationService.getMessagesByTicketId(ticketId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
});

export default router;
