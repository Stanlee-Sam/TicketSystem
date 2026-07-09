import React, { useState } from "react";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart2,
  Settings,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen((value) => !value);
  };

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard" },
    { icon: <BarChart2 size={20} />, label: "Analytics" },
    { icon: <Users size={20} />, label: "Team" },
    { icon: <Settings size={20} />, label: "Settings" },
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
            Admin panel
          </h1>
        </div>

        <nav className="flex flex-col gap-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.label.toLowerCase()}`}
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
            </a>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4 flex items-center gap-x-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
          U
        </div>
        <div
          className={`duration-200 flex flex-col ${isCollapsed ? "hidden" : "block"}`}
        >
          <span className="text-sm font-medium">John Doe</span>
          <span className="text-xs text-gray-400">admin@app.com</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={toggleMobileMenu}
        className={`fixed ${isMobileOpen ? "left-58" : "left-4"} top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all duration-300 lg:hidden`}
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
        className={`relative hidden h-screen bg-slate-900 p-5 pt-8 text-white duration-300 lg:flex lg:flex-col lg:justify-between ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
