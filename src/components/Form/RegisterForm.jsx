import React, { useCallback, useEffect, useState } from "react";
import Select from "../Input/Select";
import { ASYNC_SELECT } from "../../common/constant";
import HttpKit from "../../utilities/helper/HttpKit";
import { get } from "lodash";
import ApiKit from "../../utilities/helper/ApiKit";
import ButtonLoader from "../../shared/ButtonLoader";
import { toastError, toastSuccess } from "../../shared/toastHelper";
import ErrorText from "../Typo/ErrorText";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const initialState = {
  name: "",
  email: "",
  password: "",
  roles: "",
};

function RegisterForm({ init = () => {}, type = "add", data = {} }) {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...initialState });
  const [isVisible, setIsVisible] = useState(false);

  const validate = (payload) => {
    const errors = { ...initialState };
    let isValid = true;
    if (!payload.name && type !== "edit") {
      errors.name = "Name is required";
      isValid = false;
    }
    if (!payload.email && type !== "edit") {
      errors.email = "Email is required";
      isValid = false;
    }
    if (!payload.password && type !== "edit") {
      errors.password = "Password is required";
      isValid = false;
    }
    if (!payload.roles && type !== "edit") {
      errors.roles = "Role is required";
      isValid = false;
    }
    setError({ ...errors });
    return isValid;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      roles:
        typeof formData?.roles === "string"
          ? formData?.roles
          : formData?.roles?.name,
    };

    if (!validate(payload)) {
      setLoading(false);
      return;
    }

    const onSuccess = (response) => {
      init();
      toastSuccess({
        message:
          type === "add"
            ? "User Registered Successfully"
            : "User Updated Successfully",
      });
      setFormData({ ...initialState });
      setError({ ...initialState });
    };

    const onError = (error) => {
      const message = get(error, "response.data.message", "");
      toastError({
        message: message
          ? message
          : type === "add"
          ? "User Registration Failed"
          : "User Update Failed",
      });
    };

    const url =
      type === "add"
        ? ApiKit.user.postUser(payload)
        : ApiKit.user.updateUser(data.id, payload);

    url
      .then(onSuccess)
      .catch(onError)
      .finally(() => {
        setLoading(false);
      });
  };

  const getOptionsData = useCallback(({ params = {}, api, additional }) => {
    const previous = get(additional, "data.previous", "");
    const next = get(additional, "data.next", "");
    const hasPrevious = Boolean(previous);
    const hasNext = Boolean(next);
    let hasMore = false;

    const onSuccess = (response) => {
      const data = get(response, "data", {});
      const _hasNext = get(data, "next", "");
      const options = get(data, "roles", []);
      setRoles((prevOptions) => [...prevOptions, ...options]);
      hasMore = Boolean(_hasNext);

      return {
        options,
        hasMore,
        additional: {
          data,
        },
      };
    };

    const onError = (error) => {
      return {
        options: [],
        hasMore,
      };
    };

    if (!hasNext && !hasPrevious) {
      return api(params).then(onSuccess).catch(onError);
    } else if (hasNext) {
      return HttpKit.get(next).then(onSuccess).catch(onError);
    } else {
      return {
        options: [],
        hasMore,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrganizations = (inputValue, prevOptions, additional) => {
    return getOptionsData({
      params: inputValue ? { keyword: inputValue } : {},
      name: "roles",
      api: ApiKit.role.getRoles,
      additional,
    });
  };

  const getSelectValue = (options, value) => {
    return options.filter((item) =>
      typeof value === "string"
        ? item?.name === value
        : item?.name === value?.name
    );
  };

  useEffect(() => {
    if (type === "edit") {
      const roles = get(data, "roles", "");
      setFormData({
        name: get(data, "name", ""),
        email: get(data, "email", ""),
        password: get(data, "password", ""),
        roles: Array.isArray(roles) ? roles[0] : roles,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const VisibilityButton = () => {
    return (
      <div
        className="absolute left-auto right-1 top-5 cursor-pointer pr-[1px]"
        onClick={() => {
          setIsVisible(!isVisible);
        }}
      >
        <span className="text-gray-600 text-xl font-semibold">
          {isVisible ? (
            <FaEye className="text-gray-600" />
          ) : (
            <FaEyeSlash className="text-gray-600" />
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="">
      <img src="/tec_logo.png" alt="logo" className="mx-auto w-32" />
      <form onSubmit={handleRegister} className="mt-6">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-gray-800"
          >
            User Name
          </label>
          <input
            type="text"
            value={formData?.name}
            className="block w-full px-2 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setError((prev) => ({ ...prev, name: "" }));
            }}
          />
          <ErrorText error={error.name} />
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
            value={formData?.email}
            className="block w-full px-2 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setError((prev) => ({ ...prev, email: "" }));
            }}
          />
          <ErrorText error={error.email} />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-800"
          >
            Password
          </label>
          <div className="relative w-full flex items-center select-none">
            <input
              type={isVisible ? "text" : "password"}
              id="password"
              value={formData?.password}
              className="block w-full px-2 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError((prev) => ({ ...prev, password: "" }));
              }}
            />
            <VisibilityButton />
          </div>
          <ErrorText error={error.password} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-gray-800">
            Select Role
          </label>
          <Select
            type={ASYNC_SELECT}
            cacheOptions
            defaultOptions
            loadOptions={loadOrganizations}
            value={getSelectValue(roles, formData.roles)}
            getOptionLabel={(option) => {
              return get(option, "name", "");
            }}
            getSelectedOptionLabel={(option) => {
              return get(option, "name", "");
            }}
            getOptionValue={(option) => get(option, "name", "")}
            placeholder={"Select Role"}
            onChange={(items) => {
              setFormData({ ...formData, roles: items });
              setError((prev) => ({ ...prev, roles: "" }));
            }}
          />
          <ErrorText error={error.roles} />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            onClick={handleRegister}
          >
            <div
              className={`flex items-center ${
                loading ? "justify-evenly" : "justify-center"
              }`}
            >
              <ButtonLoader isLoading={loading} />
              <span>{type === "add" ? "Register" : "Update"}</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
