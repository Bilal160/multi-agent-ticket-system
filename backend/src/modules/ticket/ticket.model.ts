import mongoose, { Document, Schema } from 'mongoose';

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_USER = 'WAITING_FOR_USER',
  WAITING_FOR_ADMIN = 'WAITING_FOR_ADMIN',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ITicket extends Document {
  guestEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAgent?: string; 
  confidenceScore?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
  {
    guestEmail: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
    },
    assignedAgent: { type: String },
    confidenceScore: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<ITicket>('Ticket', TicketSchema);
