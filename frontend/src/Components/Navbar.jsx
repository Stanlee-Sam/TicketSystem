import { CircleUser } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 transition-colors ${
      isActive
        ? "border-b-2 text-primary"
        : "text-muted hover:bg-bg-soft hover:text-primary"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center justify-between border-b border-line bg-card px-6 py-4 font-body fixed z-50 top-0 left-0 right-0 w-full">
      <div>
        <NavLink
          to="/raise-ticket"
          className="font-heading text-lg font-bold text-primary"
        >
          Ticket System
        </NavLink>
      </div>
      <ul className="flex items-center gap-2 text-xs font-semibold  tracking-wider">
        <li>
          <NavLink to="/raise-ticket" className={linkClass}>
            Raise Ticket
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-tickets" className={linkClass}>
            View Tickets
          </NavLink>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        <NavLink to="/settings">
          <CircleUser className="h-5 w-5 cursor-pointer text-muted transition-colors hover:text-primary" />
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
