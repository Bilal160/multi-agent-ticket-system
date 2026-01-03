import { Router } from 'express';
import * as adminController from './admin.controller';

const router = Router();

router.get('/tickets', adminController.getDashboard);
router.patch('/tickets/:id/approve', adminController.approveTicketResponse);
router.patch('/tickets/:id/reject', adminController.rejectTicketResponse);

export default router;
