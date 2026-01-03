import { Request, Response, NextFunction } from 'express';
import * as ticketService from './ticket.service';

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
}
