import { useState } from "react";
import { ticketApi } from "../services/api";
import { Send, Sparkles, CheckCircle } from "lucide-react";

export const LandingPage = () => {
  const [formData, setFormData] = useState({
    guestEmail: "",
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ticket = await ticketApi.createTicket(formData);
      setTicketId(ticket._id);
      setSuccess(true);
      setFormData({ guestEmail: "", subject: "", description: "" });
    } catch (error) {
      console.error("Failed to create ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full text-center p-8 space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Submitted!</h2>
            <p className="text-gray-600">
              We've received your request and our AI is analyzing it.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Your Ticket ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900">{ticketId}</p>
            <p className="text-sm text-gray-500 mt-2">
              Check your email for updates and a link to view your ticket.
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => window.location.href = `/tickets/${ticketId}`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex-1 hover:bg-indigo-700 transition"
            >
              View Ticket
            </button>
            <button
              onClick={() => setSuccess(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex-1 hover:bg-gray-300 transition"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Support</h1>
          </div>
          <p className="text-lg text-gray-600">
            Get instant help powered by AI. Our intelligent agents will analyze and respond to your request.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of your issue"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide as much detail as possible..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Ticket</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Our AI will classify and route your request to the appropriate specialist agent for the fastest resolution.
        </p>
      </div>
    </div>
  );
};
