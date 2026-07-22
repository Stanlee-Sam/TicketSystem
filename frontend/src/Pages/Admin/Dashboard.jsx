import React, { useEffect } from "react";
import { useState } from "react";
// import { Eye, Edit, Filter, AlertCircle, CheckCircle, Inbox, AlertTriangle, Clock, Check, Plus } from "lucide-react";
import Sidebar from "../../Components/Sidebar";
import EmptyState from "../../Components/EmptyState";
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  AlertCircle,
  Eye,
  Edit,
  CheckCircle,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ZoomIn,
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Save,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { HashLoader } from "react-spinners";

// const tickets = [
//   {
//     id: "#TK-88421",
//     title: "Epic Login Failure - Ward 4B",
//     category: "Auth Module",
//     priority: "CRITICAL",
//     priorityClass: "text-danger",
//     status: "OPEN",
//     statusClass: "bg-primary text-on-primary",
//     createdAt: "Oct 24, 2024",
//     createdTime: "08:14 AM",
//     pulse: true,
//     description:
//       "User authentication system in Ward 4B is experiencing intermittent failures, preventing staff from logging into the patient management system. This is affecting patient care operations.",
//   },
//   {
//     id: "#TK-88415",
//     title: "Printer Jam - Floor 3 Nurse Station",
//     category: "Hardware",
//     priority: "MEDIUM",
//     priorityClass: "text-warning",
//     status: "IN PROGRESS",
//     statusClass: "bg-warning-soft text-tertiary",
//     createdAt: "Oct 23, 2024",
//     createdTime: "11:45 PM",
//     description:
//       "Printer at Floor 3 Nurse Station is jammed and requires immediate attention. Replacement toner cartridge is ready.",
//   },
//   {
//     id: "#TK-88409",
//     title: "VPN Connection Issues - Remote Staff",
//     category: "Networking",
//     priority: "HIGH",
//     priorityClass: "text-danger-dark",
//     status: "RESOLVED",
//     statusClass: "bg-success text-on-primary",
//     createdAt: "Oct 23, 2024",
//     createdTime: "04:30 PM",
//     description:
//       "Remote staff members are experiencing unstable VPN connections affecting their ability to access patient records from home.",
//   },
//   {
//     id: "#TK-88390",
//     title: "Software Update - Lab Terminals",
//     category: "Maintenance",
//     priority: "LOW",
//     priorityClass: "text-primary",
//     status: "CLOSED",
//     statusClass: "bg-inverse text-on-inverse",
//     createdAt: "Oct 22, 2024",
//     createdTime: "09:12 AM",
//     description:
//       "Scheduled software update for lab terminals completed successfully.",
//   },
//   {
//     id: "#TK-88432",
//     title: "New Keyboard Request - Oncology",
//     category: "Procurement",
//     priority: "LOW",
//     priorityClass: "text-primary",
//     status: "OPEN",
//     statusClass: "bg-primary text-on-primary",
//     createdAt: "Oct 24, 2024",
//     createdTime: "10:05 AM",
//     description:
//       "Ergonomic keyboard requested for Oncology department workstation.",
//   },
// ];

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticketMetrics, setTicketMetrics] = useState({});
  const [modalStatus, setModalStatus] = useState("");
  const [modalResolution, setModalResolution] = useState("");

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalStatus(ticket.status || "OPEN");
    setModalResolution(ticket.resolutionNote || "");
  };

  const editTicket = (ticket) => {
    setEditingTicket(ticket);
    setModalStatus(ticket.status || "OPEN");
    setModalResolution(ticket.resolutionNote || "");
  };

  const closeEditing = () => {
    setEditingTicket(null);
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/ticket`);
      const processedTickets = response.data.map((ticket) => {
        // Format date and time
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
          id: ticket.id,
        };
      });
      setTickets(processedTickets);
    } catch (error) {
      toast.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/ticket/metrics`,
      );
      setTicketMetrics(response.data);
    } catch (error) {
      toast.error("Failed to fetch ticket metrics:", error);
    }
  };

  const handleUpdateTicket = async (ticketId) => {
    try {
      await axios.put(`http://localhost:5000/ticket/${ticketId}`, {
        status: modalStatus,
        resolutionNote: modalResolution,
      });
      toast.success("Ticket updated successfully!");
      closeModal();
      closeEditing();
      fetchTickets();
      fetchMetrics();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update ticket");
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchTickets();
      await fetchMetrics();
    };
    init();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col gap-5 p-10 overflow-y-auto bg-bg lg:pl-80 xl:pl-72">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-end py-3">
            <div>
              <h1 className="text-3xl font-bold text-text">
                IT Command Center
              </h1>
              <p className="text-secondary">
                Real-time status of hospital system support tickets.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card border border-line p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-secondary/50 rounded-lg">
                  <Inbox className="text-primary h-6 w-6" />
                </div>
                {/* <span className="font-semibold text-success">+4% from avg</span> */}
              </div>
              <p className="text-sm text-secondary font-semibold">
                Open Tickets
              </p>
              <h2 className="font-bold text-4xl mt-1 text-text">
                {ticketMetrics.byStatus?.OPEN || 0}
              </h2>
            </div>
            <div className="bg-card border-2 border-danger/20 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-danger/50 rounded-lg">
                  <AlertTriangle className="text-danger h-6 w-6" />
                </div>
                <span className="font-semibold text-danger">
                  Critical Alert
                </span>
              </div>
              <p className="text-sm text-secondary font-semibold">
                High Priority
              </p>
              <h2 className="font-bold text-4xl mt-1 text-danger">
                {ticketMetrics.byPriority?.CRITICAL || 0}
              </h2>
            </div>
            <div className="bg-card border border-line p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="text-warning h-6 w-6" />
                </div>
                <span className="font-semibold text-warning">Active Sync</span>
              </div>
              <p className="text-sm text-secondary font-semibold">
                In Progress
              </p>
              <h2 className="font-bold text-4xl mt-1 text-text">
                {ticketMetrics.byStatus?.IN_PROGRESS || 0}
              </h2>
            </div>
            <div className="bg-card border border-line p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="text-success h-6 w-6" />
                </div>
                <span className="font-semibold text-success">Target Met</span>
              </div>
              <p className="text-sm text-secondary font-semibold">
                Resolved (24h)
              </p>
              <h2 className="font-bold text-4xl mt-1 text-text">
                {ticketMetrics.byStatus?.RESOLVED || 0}
              </h2>
            </div>
          </div>
          <div className="bg-secondary/5 border border-line rounded-xl p-4 mb-4 flex flex-col items-start gap-3">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full">
              <div className="flex flex-row items-center gap-2">
                <Filter className="text-muted h-4 w-4" />
                <span className="text-sm font-bold text-muted">Filter by:</span>
              </div>
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-center w-full md:w-auto">
                <select className="bg-card border border-line-strong rounded-lg text-sm focus:ring-2 focus:ring-brand-soft focus:border-primary px-3 py-1.5">
                  <option>All Priorities</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select className="bg-card border border-line-strong rounded-lg text-sm focus:ring-2 focus:ring-brand-soft focus:border-primary px-3 py-1.5">
                  <option>All Departments</option>
                  <option>ER (Emergency)</option>
                  <option>Cardiology</option>
                  <option>Pharmacy</option>
                  <option>Radiology</option>
                  <option>Administration</option>
                </select>
                <select className="bg-card border border-line-strong rounded-lg text-sm focus:ring-2 focus:ring-brand-soft focus:border-primary px-3 py-1.5">
                  <option>All Statuses</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Pending Vendor</option>
                </select>
              </div>
            </div>
            <div className="text-sm font-bold text-muted">
              Showing 1-10 of 124 Results
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center h-[50dvh]">
                <HashLoader color="#003c90" />
              </div>
            ) : tickets.length === 0 ? (
              <EmptyState
                title="No tickets found"
                description="There are no support tickets in the system at the moment."
              />
            ) : (
              <>
                <div className="divide-y divide-line md:hidden">
                  {tickets.map((ticket) => (
                    <TicketCard
                      onOpenModal={() => openModal(ticket)}
                      onUpdateTicket={() => editTicket(ticket)}
                      key={ticket.id}
                      ticket={ticket}
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
                          className="transition-colors hover:bg-bg-soft cursor-pointer"
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
                              {ticket.priority === "CRITICAL" && (
                                <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
                              )}
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
                            <div className="flex items-center justify-end gap-2">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openModal(ticket);
                                }}
                                label="View Details"
                                icon={Eye}
                              />
                              <IconButton
                                label="Update Ticket"
                                icon={Pencil}
                                muted
                                onClick={(event) => {
                                  event.stopPropagation();
                                  editTicket(ticket);
                                }}
                              />
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
              </>
            )}
          </div>

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
                    <div className="relative">
                      <select
                        className="cursor-pointer appearance-none rounded-lg border border-line-strong bg-card py-1 pl-3 pr-8 text-xs font-bold text-primary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                        value={modalStatus}
                        onChange={(e) => setModalStatus(e.target.value)}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none h-5 w-5" />
                    </div>
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
                          {selectedTicket.description ||
                            "No description provided."}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                          Attached Media (1)
                        </h3>
                        <div className="group relative h-48 w-48 cursor-zoom-in overflow-hidden rounded-lg border border-line">
                          <img
                            alt="Monitor sync issue illustration"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            src="https://lh3.googleusercontent.com/aida/AP1WRLs9-57llaoX4zvt-rnyixUuvjEU2-ljT181dN4FR2Fn7EM5Hee8tkCMaxorLz5ngKLDDKtPSfQDRzQsbFdduVqLb9hROgoHbze6h4xo80_WAXYBPEx-qJy4l9ChHZl6sHVTlunHrAcYBr9A4VnA3sYIIUGMaCqElAM537KxwqTWdxzzGI7IEyygl2CwWj47PXPvipI7UdQbb9cSGKroDm5ASlxAaKjHm-W7echFgkeMEXHzX_sAGLvAjOI"
                          />
                          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="text-white h-8 w-8" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                            Resolution Notes
                          </h3>
                        </div>
                        <textarea
                          className="h-40 w-full resize-none rounded-lg border border-line-strong bg-card p-4 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                          placeholder="Document steps taken, parts replaced, or vendor ticket IDs here..."
                          value={modalResolution}
                          onChange={(e) => setModalResolution(e.target.value)}
                        ></textarea>
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
                              Dr. Sarah Chen
                            </span>
                            <span className="text-sm text-muted">
                              Attending Physician
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2 text-muted">
                            <Mail className="h-5 w-5" />
                            <span className="text-sm">s.chen@medtech.org</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted">
                            <Phone className="h-5 w-5" />
                            <span className="text-sm">Ext. 4492 (ER Hub)</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted">
                            <MapPin className="h-5 w-5" />
                            <span className="text-sm">
                              Trauma Wing, Level 1
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
                <footer className="flex items-center justify-end gap-3 border-t border-line bg-card-soft px-5 py-4">
                  <button
                    className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                    onClick={closeModal}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTicket(selectedTicket.id)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-soft active:scale-95"
                    type="button"
                  >
                    <Save className="h-5 w-5" />
                    Save Changes
                  </button>
                </footer>
              </div>
            </div>
          )}

          {editingTicket && (
            <div
              onClick={closeEditing}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            >
              <div
                className="flex w-full max-w-xl flex-col overflow-hidden rounded-lg border border-line bg-card shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <header className="flex items-start justify-between gap-4 border-b border-line bg-card-soft px-5 py-4">
                  <div>
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-primary">
                      {editingTicket.id}
                    </span>
                    <h2 className="text-xl font-bold text-text">
                      Update Ticket
                    </h2>
                  </div>
                  <button
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-card-muted hover:text-danger"
                    onClick={closeEditing}
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </header>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">
                      Ticket
                    </p>
                    <p className="mt-1 text-sm font-semibold text-text">
                      {editingTicket.title}
                    </p>
                    <p className="mt-1 text-xs text-subtle">
                      {editingTicket.category} &bull; Created{" "}
                      {editingTicket.createdAt}
                    </p>
                  </div>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      Status
                    </span>
                    <select
                      className="mt-2 w-full rounded-lg border border-line-strong bg-card px-4 py-2.5 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value)}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">
                      Resolution Notes
                    </span>
                    <textarea
                      className="mt-2 h-32 w-full resize-none rounded-lg border border-line-strong bg-card px-4 py-3 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                      placeholder="Document steps taken, parts replaced, or vendor ticket IDs here..."
                      value={modalResolution}
                      onChange={(e) => setModalResolution(e.target.value)}
                    />
                  </label>
                </div>

                <footer className="flex justify-end gap-3 border-t border-line bg-card-soft px-5 py-4">
                  <button
                    className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                    onClick={closeEditing}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateTicket(editingTicket.id)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-soft active:scale-95"
                    type="button"
                  >
                    <Save className="h-5 w-5" />
                    Save Update
                  </button>
                </footer>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const TicketCard = ({ ticket, onOpenModal, onUpdateTicket }) => (
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
          className={`mt-1 inline-flex items-center gap-1.5 text-xs font-bold ${ticket.priorityClass}`}
        >
          {ticket.priority === "CRITICAL" && (
            <span className="h-2 w-2 rounded-full bg-danger animate-pulse" />
          )}
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

    <div className="mt-3 grid grid-cols-2 gap-2">
      <button
        onClick={onOpenModal}
        className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-soft hover:shadow-md"
      >
        <Eye size={16} />
        <span>View Details</span>
      </button>
      <button
        onClick={onUpdateTicket}
        className="flex items-center justify-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5 text-sm font-semibold text-text shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary hover:shadow-md"
      >
        <Pencil size={16} />
        <span>Update Ticket</span>
      </button>
    </div>
  </article>
);

const IconButton = ({ icon: Icon, label, muted = false, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-lg p-2 transition-colors hover:bg-card-muted ${
      muted
        ? "text-muted hover:text-text"
        : "text-primary hover:text-primary-soft"
    }`}
    title={label}
    type="button"
  >
    <Icon className="h-5 w-5" aria-hidden="true" />
  </button>
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

const StatCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-line bg-card p-4 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.iconClass}`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {stat.label}
        </p>
        <p className="font-heading text-2xl font-bold text-text">
          {stat.value}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
