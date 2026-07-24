import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  Eye,
  ListFilter,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
  User,
  UserCheck,
  X,
  ZoomIn,
} from "lucide-react";
import Navbar from "../../Components/Navbar";
import EmptyState from "../../Components/EmptyState";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { HashLoader } from "react-spinners";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const previousTicketsRef = useRef([]);
  const [notifications, setNotifications] = useState([]);

  // Auto-dismiss notifications after 8s
  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((n) =>
      setTimeout(() => {
        setNotifications((prev) => prev.filter((p) => p.id !== n.id));
      }, 8000),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [notifications]);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
  };

  const formatStatusLabel = (status) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  const notifyTicketStatusChanges = (newTickets) => {
    if (previousTicketsRef.current.length === 0) {
      previousTicketsRef.current = newTickets;
      return;
    }

    newTickets.forEach((ticket) => {
      const previous = previousTicketsRef.current.find(
        (prevTicket) => prevTicket.id === ticket.id,
      );

      if (previous && previous.status !== ticket.status) {
        const message = `Ticket ${ticket.ticketNumber} is now ${formatStatusLabel(
          ticket.status,
        )}`;
        // push a top-banner notification
        setNotifications((prev) => [
          { id: ticket.id + "-" + Date.now(), ticketId: ticket.id, message },
          ...prev,
        ]);
        // small toast as well for compatibility
        toast(message);

        // If the ticket modal is open for this ticket, update it in-place
        if (selectedTicket?.id === ticket.id) {
          setSelectedTicket((prev) => ({ ...prev, status: ticket.status }));
        }
      }
    });

    previousTicketsRef.current = newTickets;
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/ticket");
      const processedTickets = response.data.map((ticket) => {
        const date = new Date(ticket.createdAt);
        const createdAt = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const createdTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Priority class mapping
        let priorityClass;
        switch (ticket.priority) {
          case "CRITICAL":
            priorityClass = "text-danger";
            break;
          case "HIGH":
            priorityClass = "text-danger-dark";
            break;
          case "MEDIUM":
            priorityClass = "text-warning";
            break;
          case "LOW":
          default:
            priorityClass = "text-primary";
            break;
        }

        // Status class mapping
        let statusClass;
        switch (ticket.status) {
          case "OPEN":
            statusClass = "bg-primary text-on-primary";
            break;
          case "IN_PROGRESS":
            statusClass = "bg-warning-soft text-tertiary";
            break;
          case "RESOLVED":
            statusClass = "bg-success text-on-primary";
            break;
          case "CLOSED":
            statusClass = "bg-inverse text-on-inverse";
            break;
          default:
            statusClass = "bg-secondary text-secondary";
            break;
        }

        return {
          ...ticket,
          createdAt,
          createdTime,
          priorityClass,
          statusClass,
        };
      });
      // Restrict to current user unless admin
      let visibleTickets = processedTickets;
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const role = storedUser?.role;
        if (storedUser && role !== "IT_ADMIN" && role !== "ADMIN") {
          visibleTickets = processedTickets.filter(
            (t) => t.submitter?.id === storedUser.id,
          );
        }
      } catch (e) {
        // ignore parse errors and show all tickets as a fallback
        console.warn("Failed to parse stored user", e);
      }

      notifyTicketStatusChanges(visibleTickets);
      setTickets(visibleTickets);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tickets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchTickets();
    };

    init();
    const intervalId = setInterval(fetchTickets, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-bg font-body text-text mt-9">
      <Navbar />
      {/* Top notification banner */}
      {notifications.length > 0 && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full max-w-3xl px-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="mb-2 rounded-lg border border-line bg-primary/95 p-3 text-white shadow-lg flex items-center justify-between"
            >
              <div className="text-sm font-medium">{n.message}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ticket = tickets.find((t) => t.id === n.ticketId);
                    if (ticket) openModal(ticket);
                    setNotifications((prev) => prev.filter((p) => p.id !== n.id));
                  }}
                  className="rounded bg-white/10 px-3 py-1 text-xs font-semibold"
                >
                  View
                </button>
                <button
                  onClick={() => setNotifications((prev) => prev.filter((p) => p.id !== n.id))}
                  className="rounded bg-white/10 px-3 py-1 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <main className="flex flex-col gap-4 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <div className="my-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1 className="font-heading text-3xl font-bold text-text">
            My Tickets
          </h1>
          <Link
            to="/raise-ticket"
            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-soft hover:shadow-md"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Create Ticket
          </Link>
        </div>

        <div className="mb-4 flex flex-col gap-2 items-left md:flex-row md:items-center gap-4 rounded-lg border border-line bg-card p-4 shadow-sm">
          <div className="relative min-w-[260px] flex-1">
            <Search
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />
            <input
              className="w-full rounded-lg border border-line-strong bg-bg-soft py-2.5 pl-10 pr-4 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
              placeholder="Search ticket title, ID, or submitter..."
              type="text"
            />
          </div>

          <FilterSelect
            label="Status"
            options={[
              "All Tickets",
              "Open",
              "In Progress",
              "Resolved",
              "Closed",
            ]}
          />
          <FilterSelect
            label="Priority"
            options={["All Priorities", "Critical", "High", "Medium", "Low"]}
          />

          <button className="md:ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary-soft">
            <ListFilter className="h-4 w-4" aria-hidden="true" />
            Advanced Filters
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[50dvh]">
            <HashLoader color="#003c90" />
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="You haven't created any tickets yet. Click the button below to submit your first support ticket."
            actionLabel="Create Ticket"
            onAction={() => window.location.href = "/raise-ticket"}
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
            <div className="divide-y divide-line md:hidden">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onOpenModal={openModal}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead className="border-b border-line bg-card-soft">
                  <tr>
                    {[
                      "Ticket Title",
                      "Priority",
                      "Status",
                      "Date Created",
                      "Actions",
                    ].map((heading) => (
                      <th
                        className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted ${
                          ["Priority", "Status"].includes(heading)
                            ? "text-center"
                            : heading === "Actions"
                              ? "text-right"
                              : ""
                        }`}
                        key={heading}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {tickets.map((ticket) => (
                    <tr
                      className="cursor-pointer transition-colors hover:bg-bg-soft"
                      key={ticket.id}
                      onClick={() => openModal(ticket)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-text">
                            {ticket.title}
                          </span>
                          <span className="text-xs text-subtle">
                            ID: {ticket.ticketNumber} &bull; {ticket.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold ${ticket.priorityClass}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${ticket.statusClass}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {ticket.createdAt} &bull; {ticket.createdTime}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              openModal(ticket);
                            }}
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-line bg-bg-soft px-6 py-4 sm:flex-row">
              <span className="text-sm text-muted">
                Showing <span className="font-bold text-text">1 - 5</span> of{" "}
                <span className="font-bold text-text">24</span> tickets
              </span>
              <div className="flex items-center gap-2">
                <PageButton disabled icon={ChevronLeft} label="Previous page" />
                {[1, 2, 3].map((page) => (
                  <button
                    className={`h-8 w-8 rounded text-xs font-semibold transition-colors ${
                      page === 1
                        ? "bg-primary text-on-primary"
                        : "text-muted hover:bg-card-muted"
                    }`}
                    key={page}
                    type="button"
                  >
                    {page}
                  </button>
                ))}
                <PageButton icon={ChevronRight} label="Next page" />
              </div>
            </div>
          </div>
        )}
      </main>
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-line bg-card shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-line bg-card-soft px-5 py-4">
              <div className="min-w-0">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-primary">
                  {selectedTicket.id}
                </span>
                <h2 className="text-xl font-bold leading-7 text-text sm:text-2xl">
                  {selectedTicket.title}
                </h2>
              </div>
              <button
                className="rounded-lg p-2 text-muted transition-colors hover:bg-card-muted hover:text-danger"
                onClick={() => closeModal()}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <section className="flex flex-wrap items-center gap-3 border-b border-line bg-bg-soft px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  PRIORITY:
                </span>
                <span
                  className={`rounded-full border border-current/20 px-2.5 py-1 text-xs font-bold ${selectedTicket.priorityClass}`}
                >
                  {selectedTicket.priority}
                </span>
              </div>
              <div className="hidden h-4 w-px bg-line sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  STATUS:
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${selectedTicket.statusClass}`}
                >
                  {selectedTicket.status}
                </span>
              </div>
              <div className="hidden h-4 w-px bg-line sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  DEPT:
                </span>
                <span className="text-sm font-medium text-text">
                  {selectedTicket.category}
                </span>
              </div>
              <div className="hidden h-4 w-px bg-line sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  CREATED:
                </span>
                <span className="text-sm font-medium text-text">
                  {selectedTicket.createdAt}
                </span>
              </div>
            </section>
            <div className="flex-grow overflow-y-auto p-5">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="space-y-6 md:w-[70%]">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                      Issue Description
                    </h3>
                    <div className="rounded-lg border border-line bg-bg-soft p-4 text-sm leading-relaxed text-text">
                      {selectedTicket.description || "No description provided."}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                      Resolution & Admin Update Notes
                    </h3>
                    <div className="rounded-lg border border-line bg-bg-soft p-4 text-sm leading-relaxed text-text font-medium italic">
                      {selectedTicket.resolutionNote ||
                        "No update notes from the admin yet."}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                      Attached Media
                    </h3>
                    {selectedTicket.attachments?.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {selectedTicket.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="group relative h-48 overflow-hidden rounded-lg border border-line"
                          >
                            <img
                              alt="Ticket attachment"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              src={attachment.fileUrl}
                            />
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="text-white h-8 w-8" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-line bg-bg-soft p-4 text-sm text-muted">
                        No attachments were included with this ticket.
                      </div>
                    )}
                  </div>
                </div>
                <aside className="space-y-6 md:w-[30%]">
                  <div className="space-y-4 rounded-lg border border-line bg-bg-soft p-4">
                    <h3 className="border-b border-line pb-2 text-xs font-bold uppercase tracking-wider text-muted">
                      Staff Information
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="text-primary h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-text">
                          {selectedTicket.submitter?.fullName || "Unknown staff"}
                        </span>
                        <span className="text-sm text-muted">
                          {selectedTicket.submitter?.role || "Staff"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2 text-muted">
                        <Mail className="h-5 w-5" />
                        <span className="text-sm">
                          {selectedTicket.submitter?.email || "No email available"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Phone className="h-5 w-5" />
                        <span className="text-sm">
                          {selectedTicket.submitter?.phone || "No phone available"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <MapPin className="h-5 w-5" />
                        <span className="text-sm">
                          {selectedTicket.submitter?.department?.name || "No department assigned"}
                        </span>
                      </div>
                    </div>
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
                      <MessageCircle className="h-5 w-5" />
                      Message Submitter
                    </button>
                  </div>
                  <div className="px-1">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">
                      History
                    </h3>
                    <div className="relative space-y-4 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-px before:bg-line">
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success ring-4 ring-card">
                          <CheckCircle className="text-white h-3 w-3" />
                        </div>
                        <p className="text-xs font-bold text-text">
                          Ticket Created
                        </p>
                        <p className="text-[11px] text-subtle">
                          Oct 24, 08:12 AM
                        </p>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-card">
                          <UserCheck className="text-white h-3 w-3" />
                        </div>
                        <p className="text-xs font-bold text-text">
                          Assigned to Network IT
                        </p>
                        <p className="text-[11px] text-subtle">
                          Oct 24, 08:45 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
            <footer className="flex items-center justify-end border-t border-line bg-card-soft px-5 py-4">
              <button
                onClick={() => closeModal()}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-soft active:scale-95 cursor-pointer"
              >
                Close Details
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterSelect = ({ label, options }) => (
  <div className="flex items-center gap-3">
    <label className="text-xs font-semibold uppercase tracking-wider text-muted">
      {label}:
    </label>
    <select className="min-w-[140px] rounded-lg border border-line-strong bg-card px-3 py-2.5 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft">
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  </div>
);

const TicketCard = ({ ticket, onOpenModal }) => (
  <article className="p-4 flex flex-col gap-3">
    <div className="flex  items-start gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
          {ticket.ticketNumber}
        </p>
        <h2 className="mt-1 text-[15px] font-semibold leading-5 text-text">
          {ticket.title}
        </h2>
        <p className="mt-1 text-xs text-muted">{ticket.category}</p>
      </div>
      <span
        className={`ml-auto shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${ticket.statusClass}`}
      >
        {ticket.status}
      </span>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className="rounded-lg bg-bg-soft px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">
          Priority
        </p>
        <span
          className={`mt-1 items-center gap-1.5 text-xs font-bold ${ticket.priorityClass}`}
        >
          {ticket.priority}
        </span>
      </div>
      <div className="rounded-lg bg-bg-soft px-3 py-3 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">
          Created
        </p>
        <div className="flex flex-row justify-between items-center">
          <p className="mt-1 text-xs font-medium text-text">
            {ticket.createdAt}
          </p>
          <p className="text-xs text-subtle">{ticket.createdTime}</p>
        </div>
      </div>
    </div>

    <div className="mt-3">
      <button
        onClick={() => onOpenModal(ticket)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-soft hover:shadow-md cursor-pointer"
      >
        <Eye size={16} />
        <span>View Details</span>
      </button>
    </div>
  </article>
);

const PageButton = ({ disabled = false, icon: Icon, label }) => (
  <button
    aria-label={label}
    className="rounded border border-line-strong p-1.5 text-muted transition-colors hover:bg-card-muted disabled:cursor-not-allowed disabled:opacity-50"
    disabled={disabled}
    type="button"
  >
    <Icon className="h-5 w-5" aria-hidden="true" />
  </button>
);

export default MyTickets;
