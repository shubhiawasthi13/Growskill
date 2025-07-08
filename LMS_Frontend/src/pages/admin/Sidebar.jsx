import React from "react";
import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Book } from "lucide-react";

function Sidebar() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar - fixed on desktop */}
      <div className="w-full md:w-64 md:fixed top-0 left-0 h-full z-40 bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-md p-4 flex md:flex-col gap-4 pt-25">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded transition"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/admin/course"
          className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded transition"
        >
          <Book size={20} />
          <span>Course</span>
        </Link>
      </div>

      {/* Main content area */}
      <div className="flex-1 md:ml-64 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;
