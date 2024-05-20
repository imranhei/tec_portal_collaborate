import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateLocalRoutes = () => {
  // State to hold the user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect to retrieve user data from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    // Render a loading indicator while user data is being retrieved
    return <div>Loading...</div>;
  }

  // Check if user is logged in
  if (!user) {
    // Redirect to login page or another appropriate page
    return <Navigate to="/login" />;
  }

  return user?.role === "Super Admin" ||
    user?.role === "Admin" ||
    "Electrician" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateLocalRoutes;
