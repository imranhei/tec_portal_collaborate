import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ButtonLoader from "../shared/ButtonLoader";
import { toastError } from "../shared/toastHelper";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  // const dispatch = useDispatch();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email?.length < 1) {
      setError((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email" }));
      return false;
    }
    if (password?.length < 1) {
      setError((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }

    return true;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    } else {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      try {
        const response = await fetch(
          "https://backend.tec.ampectech.com/api/auth/login",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error("Invalid email or password");
        }
        const data = await response.json();
        sessionStorage.setItem("access_token", data.access_token);
        localStorage.setItem("access_token", data.access_token);
        // Token refresh logic
        if (data?.access_token) await handleTokenRefresh(data.access_token);
        if (data?.user) {
          setIsLoading(false);
          sessionStorage.setItem("user", JSON.stringify(data.user));
          if (data.user.role === "Super Admin" || data.user.role === "Admin") {
            navigate("/projects");
          } else if (data.user.role === "Electrician") {
            navigate("/current-jobs");
          }
        }
      } catch (error) {
        setIsLoading(false);
        toastError({ message: error.message });
        console.error("Error:", error);
      }
    }

    // fetch("https://backend.tec.ampectech.com/api/auth/login", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => res.json()) // Parse JSON response
    //   .then((data) => {
    //     sessionStorage.setItem("access_token", data.access_token);
    //     if (data.user) {
    //       dispatch(setUser(data.user));
    //       if(data.user.role === "Super Admin") {
    //         navigate("/projects");
    //       } else if(data.user.role === "Admin"){
    //         navigate("/current-jobs");
    //       }
    //     } else {
    // toastError({ message: "Invalid email or password" });
    //     }
    //   }) // Log parsed JSON data
    //   .catch((error) => console.error("Error:", error)); // Handle any errors
  };

  const handleTokenRefresh = async (accessToken) => {
    try {
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/auth/refresh",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      if (data?.access_token) {
        localStorage.setItem("refresh_token", data.access_token);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error; // Rethrow the error to be caught in the handleLogin function
    }
  };

  useEffect(() => {
    // check if user is already logged in
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      if (user.role === "Super Admin" || user.role === "Admin") {
        navigate("/projects");
      } else if (user.role === "Electrician") {
        navigate("/current-jobs");
      }
    }
  }, [navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-96 p-6 bg-white rounded-md shadow-md lg:max-w-xl border">
        <img src="/tec_logo.png" alt="logo" className="mx-auto w-32 pb-4" />
        <form className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => {
                setEmail(e.target.value);
                setError((prev) => ({ ...prev, email: "" }));
              }}
            />
            <p className="text-xs text-red-500">{error.email}</p>
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => {
                setPassword(e.target.value);
                setError((prev) => ({ ...prev, password: "" }));
              }}
            />
            <p className="text-xs text-red-500">{error.password}</p>
          </div>
          <Link
            to="/forget-password"
            className="text-xs text-blue-600 hover:underline"
          >
            Forget Password?
          </Link>
          <div className="mt-2">
            <button
              disabled={isLoading}
              className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 ${
                isLoading ? "cursor-not-allowed " : "cursor-pointer"
              }`}
              onClick={handleLogin}
            >
              <div
                className={`flex items-center ${
                  isLoading ? "justify-evenly" : "justify-center"
                }`}
              >
                <ButtonLoader isLoading={isLoading} />
                <span>Login</span>
              </div>
            </button>
          </div>
        </form>

        {/* <p className="mt-4 text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
