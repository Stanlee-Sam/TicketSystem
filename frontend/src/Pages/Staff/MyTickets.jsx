import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  Eye,
  ListFilter,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import Navbar from "../../Components/Navbar";

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
  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <Navbar />
      <main className="flex flex-col gap-4 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <div className="my-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1 className="font-heading text-3xl font-bold text-text">
            My Tickets
          </h1>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-on-primary shadow-sm transition-all hover:bg-primary-soft active:scale-95">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Create Ticket
          </button>
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
              <TicketCard key={ticket.id} ticket={ticket} />
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
                    className="transition-colors hover:bg-bg-soft"
                    key={ticket.id}
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
                        <IconButton label="View Details" icon={Eye} />
                        <IconButton label="Update Ticket" icon={Pencil} muted />
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

const TicketCard = ({ ticket }) => (
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

    <div className="mt-3 flex items-center justify-end gap-1.5">
      <IconButton label="View Details" icon={Eye} />
      <IconButton label="Update Ticket" icon={Pencil} muted />
    </div>
  </article>
);

const IconButton = ({ icon: Icon, label, muted = false }) => (
  <button
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
