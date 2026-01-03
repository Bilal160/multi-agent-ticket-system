import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketApi, conversationApi, adminApi } from '../services/api';
import { SenderType } from '../types';
import { ArrowLeft, Check, X, Loader, MessageCircle, Bot, User, Shield } from 'lucide-react';

export const AdminTicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleApprove = async () => {
    if (!ticket || !window.confirm('Approve this AI response?')) return;
    try {
      setActionLoading(true);
      await adminApi.approveResponse(ticket._id);
      alert('Response approved successfully!');
      await loadTicket();
      await loadMessages();
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve response.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!ticket || !window.confirm('Reject this AI response? You will need to provide a manual response.')) return;
    try {
      setActionLoading(true);
      await adminApi.rejectResponse(ticket._id);
      alert('Response rejected. Please provide a manual response.');
      await loadTicket();
      await loadMessages();
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject response.');
    } finally {
      setActionLoading(false);
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

  const needsApproval = ticket.status === 'WAITING_FOR_ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
              <p className="text-sm text-gray-500">
                {ticket.guestEmail} • Ticket ID: {ticket._id}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 py-8">
        {needsApproval && (
          <div className="card mb-6 bg-orange-50 border-orange-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">⚠️ Action Required</h3>
                <p className="text-sm text-gray-600">
                  This ticket requires admin approval before the AI response is sent to the user.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Original Request</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {ticket.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {ticket.confidenceScore !== undefined && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  AI Confidence: {(ticket.confidenceScore * 100).toFixed(0)}%
                </span>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Conversation History</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages in this conversation yet.</p>
              ) : (
                messages.map((message) => (
                  <div key={message._id} className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.senderType === SenderType.GUEST ? 'bg-primary-100 text-primary-600' : 
                      message.senderType === SenderType.AGENT ? 'bg-purple-100 text-purple-600' : 
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {getSenderIcon(message.senderType)}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        {message.senderType} • {new Date(message.createdAt).toLocaleString()}
                      </p>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
