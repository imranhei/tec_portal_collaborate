import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

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

    // Check if user is logged in
    if (!user) {
        // Redirect to login page or another appropriate page
        console.Console.log("PrivateRoutes")
        return <Navigate to="/login" />;
    }
    // console.log(user?.role) 

    // Check if user role is "Admin"
    return (
        user?.role === "Electrician" ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes;
