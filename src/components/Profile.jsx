import { useEffect, useState } from "react";
import SettingsLayout from "../shared/SettingsLayout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      const name = JSON.parse(userData)?.name;
      setName(name);
    }
  }, []);

  return (
    <SettingsLayout>
      <div className="">
        <h1 className="text-xl font-bold py-4">Profile Details</h1>
        <div className="md:w-[400px] lg:w-[600px] bg-gray-200 rounded-lg p-4">
          <div className="flex justify-center w-full border-b border-orange-600">
            <AccountCircleIcon style={{ fontSize: 100 }} />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between justify-start md:items-center px-5 py-4 border-b">
            <p className="text-lg font-semibold">Name:</p>
            <p className="text-lg">{user?.name}</p>
            {/* <input
              type="text"
              value={name}
              className="block w-full px-4 py-2 pr-10 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setName(e.target.value)}
            /> */}
          </div>
          <div className="flex flex-col md:flex-row md:justify-between justify-start md:items-center px-5 py-4 border-b">
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-lg">
              <a href={`mailto:${user?.email}`}>{user?.email}</a>
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between justify-start md:items-center px-5 py-4 border-b">
            <p className="text-lg font-semibold">Role:</p>
            <p className="text-lg">{user?.role}</p>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}

export default Profile;
