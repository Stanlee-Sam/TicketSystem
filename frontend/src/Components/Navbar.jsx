import { CircleUser, LogOut, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `md:rounded-md px-3 py-2 transition-colors ${
      isActive
        ? "border-b-2 text-primary"
        : "text-muted hover:bg-bg-soft hover:text-primary"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-primary/10 text-primary font-semibold"
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

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-wider">
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

      {/* Desktop User Actions */}
      <div className="hidden md:flex items-center gap-4">
        <NavLink to="/settings">
          <CircleUser className="h-5 w-5 cursor-pointer text-muted transition-colors hover:text-primary" />
        </NavLink>
        <button
          onClick={handleLogout}
          className="text-xs font-semibold  tracking-wider text-red-500 hover:text-red-600 transition-colors cursor-pointer flex flex-row items-center gap-2 rounded-lg border border-line bg-card hover:bg-danger/80 hover:text-white px-3 py-2.5 text-sm shadow-sm"
        >
          <LogOut size={16} />
          <p>Log Out</p>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-muted hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-line md:hidden shadow-lg">
          <ul className="flex flex-col p-2 gap-1 text-sm font-semibold">
            <li>
              <NavLink
                to="/raise-ticket"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Raise Ticket
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-tickets"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                View Tickets
              </NavLink>
            </li>
            <li className="border-t border-line mt-2 pt-2">
              <NavLink
                to="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-bg-soft hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <CircleUser className="h-5 w-5" />
                Settings
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
