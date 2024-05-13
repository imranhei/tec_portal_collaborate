import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ open }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Effect to retrieve user data from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div
      className={`h-full p-4 pb-2 md:px-4 ${
        open ? "" : "px-12"
      } border-r flex flex-col relative`}
    >
      <img src="/tec_logo.png" alt="" className="w-24 mx-auto pb-4" />
      {(user?.role === "Super Admin" || user?.role === "Admin") && (
        <>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/" ||
              location.pathname.startsWith("/projects")
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/projects"
          >
            Projects
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/employee"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/employee"
          >
            Employee
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/jobsheet"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/jobsheet"
          >
            Add Job Sheet
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location?.pathname === "/jobsheets"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/jobsheets"
          >
            Job Sheets
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/register"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/register"
          >
            Register
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/timesheet"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/timesheet"
          >
            Time Sheet
          </Link>
        </>
      )}
      {user?.role === "Electrician" && (
        <>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/current-jobs"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/current-jobs"
          >
            Current Jobs
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname.startsWith("/jobsheet")
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/jobsheet"
          >
            Job Sheet
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/timesheet"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/timesheet"
          >
            Time Sheet
          </Link>
          <Link
            className={`hover:bg-gray-200 p-2 border-b ${
              location.pathname === "/history"
                ? "font-semibold text-blue-500"
                : ""
            }`}
            to="/history"
          >
            History
          </Link>
        </>
      )}
      <Link
        className={`hover:bg-gray-200 mt-auto p-2 pb-0 border-t cursor-pointer ${
          location.pathname === "/profile" ? "font-semibold text-blue-500" : ""
        }`}
        to="/profile"
      >
        Settings
      </Link>
    </div>
  );
}
