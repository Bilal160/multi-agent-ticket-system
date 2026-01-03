import mongoose, { Document, Schema } from 'mongoose';

export enum SenderType {
  GUEST = 'GUEST',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}

export interface IMessage extends Document {
  ticketId: mongoose.Types.ObjectId;
  senderType: SenderType;
  senderId?: string; // e.g., 'refund_agent' or admin ID
  content: string;
  attachments?: string[];
  createdAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true, index: true },
    senderType: {
      type: String,
      enum: Object.values(SenderType),
      required: true,
    },
    senderId: { type: String },
    content: { type: String, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
