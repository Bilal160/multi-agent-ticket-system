import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './utils/logger';
import ticketRoutes from './modules/ticket/ticket.routes';
import conversationRoutes from './modules/conversation/conversation.routes';
import adminRoutes from './modules/admin/admin.routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/tickets', ticketRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/admin', adminRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

export default app;
