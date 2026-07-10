import {
  CheckCircle,
  ChevronDown,
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
  Pencil,
  Phone,
  Plus,
  Save,
  Search,
  User,
  UserCheck,
  X,
  ZoomIn,
} from "lucide-react";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";

const tickets = [
  {
    id: "#TK-88421",
    title: "Epic Login Failure - Ward 4B",
    category: "Auth Module",
    priority: "CRITICAL",
    priorityClass: "text-danger",
    status: "OPEN",
    statusClass: "bg-primary text-on-primary",
    createdAt: "Oct 24, 2024",
    createdTime: "08:14 AM",
    pulse: true,
    description:
      "Staff in Ward 4B cannot reliably sign in to Epic. Login attempts intermittently time out before patient charts load.",
  },
  {
    id: "#TK-88415",
    title: "Printer Jam - Floor 3 Nurse Station",
    category: "Hardware",
    priority: "MEDIUM",
    priorityClass: "text-warning",
    status: "IN PROGRESS",
    statusClass: "bg-warning-soft text-tertiary",
    createdAt: "Oct 23, 2024",
    createdTime: "11:45 PM",
    description:
      "The nurse station printer on Floor 3 is jammed and blocking medication label printing.",
  },
  {
    id: "#TK-88409",
    title: "VPN Connection Issues - Remote Staff",
    category: "Networking",
    priority: "HIGH",
    priorityClass: "text-danger-dark",
    status: "RESOLVED",
    statusClass: "bg-success text-on-primary",
    createdAt: "Oct 23, 2024",
    createdTime: "04:30 PM",
    description:
      "Remote staff are seeing repeated VPN disconnects while accessing patient systems from off-site locations.",
  },
  {
    id: "#TK-88390",
    title: "Software Update - Lab Terminals",
    category: "Maintenance",
    priority: "LOW",
    priorityClass: "text-primary",
    status: "CLOSED",
    statusClass: "bg-inverse text-on-inverse",
    createdAt: "Oct 22, 2024",
    createdTime: "09:12 AM",
    description:
      "Lab terminal software updates were requested and completed during the scheduled maintenance window.",
  },
  {
    id: "#TK-88432",
    title: "New Keyboard Request - Oncology",
    category: "Procurement",
    priority: "LOW",
    priorityClass: "text-primary",
    status: "OPEN",
    statusClass: "bg-primary text-on-primary",
    createdAt: "Oct 24, 2024",
    createdTime: "10:05 AM",
    description:
      "Oncology requested a replacement ergonomic keyboard for a clinical workstation.",
  },
];

const stats = [
  {
    label: "New Tickets",
    value: "08",
    icon: ClipboardList,
    iconClass: "bg-brand-soft text-primary",
  },
  {
    label: "In Progress",
    value: "12",
    icon: Clock3,
    iconClass: "bg-warning-soft text-tertiary",
  },
  {
    label: "Critical",
    value: "02",
    icon: CircleAlert,
    iconClass: "bg-danger-soft text-danger-dark",
  },
  {
    label: "Solved (24h)",
    value: "15",
    icon: CircleCheckBig,
    iconClass: "bg-secondary-soft text-secondary",
  },
];

const MyTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  const editTicket = (ticket) => {
    setEditingTicket(ticket);
  };

  const closeEditing = () => {
    setEditingTicket(null);
  };

  

  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <Navbar />
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

        <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
          <div className="divide-y divide-line md:hidden">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onOpenModal={openModal}
                onEditTicket={editTicket}
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
                          ID: {ticket.id} &bull; {ticket.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold ${ticket.priorityClass}`}
                      >
                        {ticket.pulse && (
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
                          label="View Details"
                          icon={Eye}
                          onClick={(event) => {
                            event.stopPropagation();
                            openModal(ticket);
                          }}
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
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
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
                <div className="relative">
                  <select
                    className="cursor-pointer appearance-none rounded-lg border border-line-strong bg-card py-1 pl-3 pr-8 text-xs font-bold text-primary transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    defaultValue={selectedTicket.status}
                  >
                    <option>OPEN</option>
                    <option>IN PROGRESS</option>
                    <option>PENDING VENDOR</option>
                    <option>RESOLVED</option>
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
                      {selectedTicket.description || "No description provided."}
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
                        <span className="text-sm">Trauma Wing, Level 1</span>
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
                onClick={() => closeModal()}
                className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-soft active:scale-95">
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
              </div>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Status
                </span>
                <select
                  className="mt-2 w-full rounded-lg border border-line-strong bg-card px-4 py-2.5 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                  defaultValue={editingTicket.status}
                >
                  <option>OPEN</option>
                  <option>IN PROGRESS</option>
                  <option>PENDING VENDOR</option>
                  <option>RESOLVED</option>
                  <option>CLOSED</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Update Notes
                </span>
                <textarea
                  className="mt-2 h-32 w-full resize-none rounded-lg border border-line-strong bg-card px-4 py-3 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                  placeholder="Add any follow-up details for this ticket..."
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

const TicketCard = ({ ticket, onOpenModal, onEditTicket }) => (
  <article className="p-4 flex flex-col gap-3">
    <div className="flex  items-start gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle">
          {ticket.id}
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
          {ticket.pulse && (
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
        onClick={() => onOpenModal(ticket)}
        className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-soft hover:shadow-md"
      >
        <Eye size={16} />
        <span>View Details</span>
      </button>
      <button
        onClick={() => onEditTicket(ticket)}
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

export default MyTickets;
