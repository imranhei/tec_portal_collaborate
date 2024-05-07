import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoggedIn } from "../redux/auth";

export default function Sidebar( {open} ) {
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

  const handleLogout = async () => {
    const response = await fetch(
      "https://backend.tec.ampectech.com/api/auth/logout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
        },
      }
    );

    if (response.ok) {
      // dispatch(setLoggedIn(false));
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className={`h-full p-4 md:px-4 ${open ? "" : "px-12"} border-r flex flex-col relative`}>
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
              location.pathname.startsWith("/jobsheet")
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
        className={`hover:bg-gray-200 p-2 border-b ${
          location.pathname === "/profile" ? "font-semibold text-blue-500" : ""
        }`}
        to="/profile"
      >
        Profile
      </Link>
      <p
        className={`hover:bg-gray-200 p-2 border-b cursor-pointer ${
          location.pathname === "/login" ? "font-semibold text-blue-500" : ""
        }`}
        onClick={handleLogout}
      >
        Logout
      </p>
    </div>
  );
}
