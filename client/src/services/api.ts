import axios, { AxiosError } from 'axios';
import type { Ticket, Message, CreateTicketRequest, AddMessageRequest, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject({
      message: errorMessage,
      statusCode: error.response?.status,
      status: error.response?.data?.status,
    } as ApiError);
  }
);

export const ticketApi = {
  createTicket: async (data: CreateTicketRequest): Promise<Ticket> => {
    const response = await api.post<Ticket>('/tickets', data);
    return response.data;
  },
  
  getTicketById: async (id: string): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },
  
  getAllTickets: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets');
    return response.data;
  },
};

export const conversationApi = {
  getMessages: async (ticketId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/conversations/tickets/${ticketId}/messages`);
    return response.data;
  },
  
  addMessage: async (ticketId: string, data: AddMessageRequest): Promise<Message> => {
    const response = await api.post<Message>(`/conversations/tickets/${ticketId}/messages`, data);
    return response.data;
  },
};

export const adminApi = {
  getDashboard: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/admin/tickets');
    return response.data;
  },
  
  approveResponse: async (ticketId: string): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/admin/tickets/${ticketId}/approve`);
    return response.data;
  },
  
  rejectResponse: async (ticketId: string): Promise<Ticket> => {
    const response = await api.patch<Ticket>(`/admin/tickets/${ticketId}/reject`);
    return response.data;
  },
};

export default api;
