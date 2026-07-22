import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronLeft, ChevronRight, Home, Users, LogOut } from "lucide-react";

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((value) => !value);
  };

  const adminMenuItems = [
    { icon: <Home size={20} />, label: "Dashboard", to: "/dashboard" },
    { icon: <Users size={20} />, label: "Create User", to: "/create-user" },
    { icon: <Users size={20} />, label: "Manage Users", to: "/manage-users" },
  ];

  const content = (
    <>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white shadow-md transition-colors hover:bg-slate-800 lg:flex"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div>
        <div className="mb-6 flex items-center gap-x-4">
          <div className="bg-indigo-500 p-2 rounded cursor-pointer min-w-10">
            <Menu size={24} />
          </div>
          <h1
            className={`origin-left font-bold text-xl duration-200 whitespace-nowrap ${
              isCollapsed ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            TicketSystem
          </h1>
        </div>

        <nav className="flex flex-col gap-y-2">
          {adminMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center gap-x-4 rounded-lg border border-transparent px-3 py-3 text-base font-semibold text-slate-100 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="flex min-w-6 items-center justify-center text-slate-300 transition-colors group-hover:text-white">
                {item.icon}
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-200 ${
                  isCollapsed
                    ? "w-0 opacity-0 overflow-hidden"
                    : "w-auto opacity-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4 flex flex-col gap-y-2">
        <div className="flex items-center gap-x-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
            U
          </div>
          <div
            className={`duration-200 flex flex-col ${isCollapsed ? "hidden" : "block"}`}
          >
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-gray-400">admin@ticketsystem.com</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-x-4 rounded-lg px-3 py-2 text-sm font-semibold text-red-400 hover:bg-slate-800 hover:text-red-300 transition-all duration-200 cursor-pointer"
        >
          <div className="flex min-w-6 items-center justify-center">
            <LogOut size={18} />
          </div>
          <span
            className={`whitespace-nowrap transition-all duration-200 ${
              isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            }`}
          >
            Log Out
          </span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={toggleMobileMenu}
        className={`fixed ${isMobileOpen ? "left-60" : "left-4"} top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all duration-300 lg:hidden`}
        aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isMobileOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${isMobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          className={`absolute inset-0 bg-slate-950/60 transition-opacity duration-300 ${isMobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={`relative z-10 h-full w-64 max-w-[85vw] transition-transform duration-300 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <aside className="flex h-full flex-col justify-between bg-slate-900 p-5 pt-8 text-white">
            {content}
          </aside>
        </div>
      </div>

      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen bg-slate-900 p-5 pt-8 text-white duration-300 lg:flex lg:flex-col lg:justify-between ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
