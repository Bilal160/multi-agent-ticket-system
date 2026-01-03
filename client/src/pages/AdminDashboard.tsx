import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../services/api";
import { LayoutDashboard, Loader, Search, Filter } from "lucide-react";

export const AdminDashboard = () => {
  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboard();
      setTickets(data);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "WAITING_FOR_USER":
        return "bg-purple-100 text-purple-800";
      case "WAITING_FOR_ADMIN":
        return "bg-orange-100 text-orange-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets by subject or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full md:w-60">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto pl-10 pr-6 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_FOR_USER">Waiting for User</option>
              <option value="WAITING_FOR_ADMIN">Waiting for Admin</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow py-12 text-center text-gray-500">
            No tickets found matching your filters.
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {filteredTickets.map((ticket: any) => (
              <div
                key={ticket._id}
                onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {ticket.subject}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ticket.guestEmail} •{" "}
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Status & Priority */}
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {ticket.description}
                </p>

                {/* Tags */}
                {ticket.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {ticket.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {ticket.confidenceScore !== undefined && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Confidence: {(ticket.confidenceScore * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
