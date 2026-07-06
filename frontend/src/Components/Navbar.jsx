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

  return (
    <nav className="flex items-center justify-between border-b border-line bg-card px-6 py-4 font-body">
      <div>
        <NavLink to="/raise-ticket" className="font-heading text-lg font-bold text-primary">
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
      <div>
        <CircleUser className="h-5 w-5 cursor-pointer text-muted transition-colors hover:text-primary" />
      </div>
    </nav>
  );
};
export default Navbar;
