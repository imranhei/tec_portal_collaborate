import { Outlet, Navigate } from 'react-router-dom'
// import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const PrivateRoutes = () => {
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

    if (!user) {
        // Redirect to login page or another appropriate page
        console.log("PrivateRoutes")
        return <Navigate to="/login" />;
    }

    return (
        user?.role === "Super Admin" || user?.role === "Admin" ? <Outlet /> : <Navigate to="/login" />
    )
}
export default PrivateRoutes;