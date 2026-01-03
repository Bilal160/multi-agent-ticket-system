import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ticketApi, conversationApi } from '../services/api';
import { SenderType } from '../types';
import { MessageCircle, ArrowLeft, Bot, User, Shield, Loader } from 'lucide-react';

export const TicketView = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      loadTicket();
      loadMessages();
    }
  }, [id]);

  const loadTicket = async () => {
    try {
      const data = await ticketApi.getTicketById(id!);
      setTicket(data);
    } catch (error) {
      console.error('Failed to load ticket:', error);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await conversationApi.getMessages(id!);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticket) return;

    try {
      setSending(true);
      await conversationApi.addMessage(ticket._id, {
        senderType: SenderType.GUEST,
        senderId: ticket.guestEmail,
        content: newMessage,
      });
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'WAITING_FOR_USER': return 'bg-purple-100 text-purple-800';
      case 'WAITING_FOR_ADMIN': return 'bg-orange-100 text-orange-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSenderIcon = (senderType: SenderType) => {
    switch (senderType) {
      case SenderType.AGENT: return <Bot className="w-5 h-5" />;
      case SenderType.ADMIN: return <Shield className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
              <p className="text-sm text-gray-500">Ticket ID: {ticket._id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {ticket.tags.map((tag: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages yet. Start the conversation below!</p>
              ) : (
                messages.map((message: any) => (
                  <div
                    key={message._id}
                    className={`flex gap-3 ${message.senderType === SenderType.GUEST ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.senderType === SenderType.GUEST ? 'bg-primary-100 text-primary-600' : 
                      message.senderType === SenderType.AGENT ? 'bg-purple-100 text-purple-600' : 
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {getSenderIcon(message.senderType)}
                    </div>
                    <div className={`flex-1 max-w-lg ${message.senderType === SenderType.GUEST ? 'text-right' : ''}`}>
                      <p className={`text-xs text-gray-500 mb-1 ${message.senderType === SenderType.GUEST ? 'text-right' : ''}`}>
                        {message.senderType} • {new Date(message.createdAt).toLocaleString()}
                      </p>
                      <div className={`rounded-lg p-4 ${
                        message.senderType === SenderType.GUEST ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="input-field flex-1"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="btn-primary"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
