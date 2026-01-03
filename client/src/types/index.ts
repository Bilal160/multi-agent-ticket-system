export interface Ticket {
  _id: string;
  guestEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  confidenceScore?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_FOR_USER: 'WAITING_FOR_USER',
  WAITING_FOR_ADMIN: 'WAITING_FOR_ADMIN',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export const TicketPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type TicketPriority = typeof TicketPriority[keyof typeof TicketPriority];

export const SenderType = {
  GUEST: 'GUEST',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN',
} as const;

export type SenderType = typeof SenderType[keyof typeof SenderType];

export interface Message {
  _id: string;
  ticketId: string;
  senderType: SenderType;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// API Request Types
export interface CreateTicketRequest {
  guestEmail: string;
  subject: string;
  description: string;
}

export interface AddMessageRequest {
  senderType: SenderType;
  senderId: string;
  content: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

export interface ApiError {
  message: string;
  status?: string;
  statusCode?: number;
}
