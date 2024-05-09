import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SettingsLayout from "../shared/SettingsLayout";
import { toastError, toastSuccess } from "../shared/toastHelper";

function Security() {
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState({
    old_password: false,
    new_password: false,
    confirmed_password: false,
  });
  const [fields, setFields] = useState({
    old_password: "",
    new_password: "",
    confirmed_password: "",
  });
  const clearForm = () => {
    setFields({
      old_password: "",
      new_password: "",
      confirmed_password: "",
    });
    setError("");
    setIsVisible({
      old_password: false,
      new_password: false,
      confirmed_password: false,
    });
  };
  const handleChangePassword = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("old_password", fields.old_password);
    formData.append("new_password", fields.new_password);
    formData.append("confirmed_password", fields.confirmed_password);

    try {
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: JSON.stringify({
            old_password: fields.old_password,
            new_password: fields.new_password,
            confirmed_password: fields.confirmed_password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Invalid password");
      }
      clearForm();
      toastSuccess({ message: "Password changed successfully!" });
    } catch (error) {
      toastError({ message: "Something Went Wrong!" });
      setError("Please enter correct password");
    }
  };

  const VisibilityButton = ({ fieldName }) => {
    return (
      <div
        className="absolute left-auto right-1 cursor-pointer pr-[1px]"
        onClick={() => {
          setIsVisible({ ...isVisible, [fieldName]: !isVisible[fieldName] });
        }}
      >
        <span className="text-gray-600 text-xl font-semibold">
          {isVisible[fieldName] ? (
            <VisibilityIcon fontSize="small" />
          ) : (
            <VisibilityOffIcon fontSize="small" />
          )}
        </span>
      </div>
    );
  };

  return (
    <SettingsLayout>
      <div>
        <p className="text-xl font-semibold">Change your password</p>
        <form
          clea
          className="mt-6 bg-gray-200 p-4 rounded-lg md:w-[400px] lg:w-[600px]"
        >
          {error && (
            <div className="bg-red-900 bg-opacity-45 flex items-center pl-2 font-semibold rounded-lg my-1 h-10 w-full">
              {error}
            </div>
          )}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Old Password
            </label>
            <div className="relative w-full flex items-center select-none">
              <input
                type={`${isVisible.old_password ? "text" : "password"}`}
                value={fields.old_password}
                placeholder="Please enter your old password"
                className="block w-full px-4 py-2 pr-10 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) => {
                  setError("");
                  setFields({ ...fields, old_password: e.target.value });
                }}
              />
              <VisibilityButton fieldName={"old_password"} />
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              New Password
            </label>

            <div className="relative w-full flex items-center select-none">
              <input
                type={`${isVisible.new_password ? "text" : "password"}`}
                value={fields.new_password}
                placeholder="Please enter your new password"
                className="block w-full px-4 py-2 pr-10 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) => {
                  setError("");
                  setFields({ ...fields, new_password: e.target.value });
                }}
              />
              <VisibilityButton fieldName={"new_password"} />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">
              Confirm Password
            </label>

            <div className="relative w-full flex items-center select-none">
              <input
                type={`${isVisible.confirmed_password ? "text" : "password"}`}
                value={fields.confirmed_password}
                placeholder="Please confirm your new password"
                className="block w-full px-4 py-2 pr-10 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) => {
                  setError("");
                  setFields({ ...fields, confirmed_password: e.target.value });
                }}
              />
              <VisibilityButton fieldName={"confirmed_password"} />
            </div>
          </div>
          <div className="mt-2">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
}

export default Security;
