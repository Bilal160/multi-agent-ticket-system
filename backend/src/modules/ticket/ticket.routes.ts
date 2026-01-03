import { Router } from 'express';
import * as ticketController from './ticket.controller';

const router = Router();

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicket);

export default router;
