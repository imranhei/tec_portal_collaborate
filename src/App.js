import { Routes, Route, useNavigate } from "react-router-dom";
import Projects from "./components/Projects";
import Login from "./components/Login";
import Register from "./components/Register";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import View from "./components/View";
import CurrentJobs from "./components/CurrentJobs";
import History from "./components/History";
import Employee from "./components/Employee";
import PrivateAdminRoute from "./components/PrivateAdminRoute";
import PrivateUserRoute from "./components/PrivateUserRoute";
import JobSheet from "./components/JobSheet";
import JobSheets from "./components/JobSheets";
import Navbar from "./components/Navbar";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [worker, setWorker] = useState(null);

  function isLoggedIn() {
    const accessToken = sessionStorage.getItem("access_token");
    // Check if the access token exists and is not expired
    return accessToken !== null;
  }

  useEffect(() => {
    const checkLoggedIn = async () => {
      setIsLoading(true);
      if (!isLoggedIn()) {
        navigate("/login");
      }
      setIsLoading(false);
    };

    checkLoggedIn();
  }, [navigate]);

  // Render loading state if still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {isLoggedIn() && (
        <>
          <div
            className={`fixed h-screen overflow-y-auto z-20 bg-white md:left-0 ${
              open ? "left-0 w-48" : "-left-48 w-60"
            } md:w-48 transition-all`}
          >
            <button
              className={`absolute top-6 block md:hidden transition-all z-10 ${
                open ? "left-40" : "left-[204px]"
              }`}
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            {/* Render Sidebar only if logged in */}
            <Sidebar open={open} />
          </div>
          <div
            className={`fixed md:h-14 h-10 w-full z-10 flex items-center bg-white shadow`}
          >
            <Navbar />
          </div>
        </>
      )}
      <div
        className={`flex-1 overflow-auto transition-all md:mt-14 mt-10 z-0 ${
          isLoggedIn() ? "md:ml-48 ml-10" : "ml-0"
        } p-4 bg-slate-100`}
      >
        {/* Render different components based on user role */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateAdminRoute />}>
            {/* Only admins are allowed to view this routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Projects />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/view" element={<View />} />
          </Route>
          <Route path="/jobsheets" element={<JobSheets />} />
          {/* <Route path="/jobsheets/view" element={<JobSheet />} /> */}
          <Route path="/jobsheet" element={<JobSheet />} />
          <Route element={<PrivateUserRoute />}>
            {/* Only users are allowed to view this routes */}
            <Route path="/current-jobs" element={<CurrentJobs />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
