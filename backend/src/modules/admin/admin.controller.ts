import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await adminService.getAllTicketsForAdmin();
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

export const approveTicketResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ticket = await adminService.approveResponse(id);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const rejectTicketResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const ticket = await adminService.rejectResponse(id);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};
