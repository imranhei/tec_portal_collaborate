import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("roles", role);

      // Send POST request to register the user
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/users",
        {
          method: "POST",
          headers: {
            // Corrected the spelling of "Authorization"
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: formData, // Sending form data, no need to set content type explicitly
        }
      );

      if (response.ok) {
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        alert("User registered successfully!");
      } else {
        throw new Error("Failed to register user");
      }
    } catch (error) {
      // Handle any errors that occur during registration
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="w-96 p-6 bg-white rounded-md shadow-md lg:max-w-xl border">
        <img src="/tec_logo.png" alt="logo" className="mx-auto w-32" />
        <form className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-800"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <label className="block text-sm font-semibold text-gray-800">
              Role:
            </label>
            <div className="flex gap-4">
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  checked={role === "Electrician"}
                  onChange={() => setRole("Electrician")}
                />
                <p className="block text-sm font-semibold text-gray-800">
                  Electrician
                </p>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  checked={role === "Admin"}
                  onChange={() => setRole("Admin")}
                />
                <p className="block text-sm font-semibold text-gray-800">
                  Admin
                </p>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  checked={role === "Super Admin"}
                  onChange={() => setRole("Super Admin")}
                />
                <p className="block text-sm font-semibold text-gray-800">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </form>

        {/* <p className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default Register;
