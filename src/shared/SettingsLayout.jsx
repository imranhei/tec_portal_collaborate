import { Link, useLocation, useNavigate } from "react-router-dom";

const SettingsLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row">
      <ul className="w-32 mr-2 text-accent flex flex-row sm:flex-col mb-2 gap-4 sm:gap-0">
        <li className="">
          <Link
            className={`hover:bg-gray-200 hover:rounded-md p-2 pb-1 border-b ${
              location.pathname === "/profile"
                ? "font-semibold text-blue-500 border-b-blue-500"
                : ""
            }`}
            to="/profile"
          >
            Profile
          </Link>
        </li>
        <li className="sm:my-4">
          <Link
            className={`hover:bg-gray-200 hover:rounded-md p-2 pb-1 border-b ${
              location.pathname === "/security"
                ? "font-semibold text-blue-500 border-b-blue-500"
                : ""
            }`}
            to="/security"
          >
            Security
          </Link>
        </li>
      </ul>
      <div className="full">
        <div className="">{props.children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
