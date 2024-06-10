import React, { useCallback, useState } from "react";
import Select from "../Input/Select";
import { ASYNC_SELECT } from "../../common/constant";
import { get } from "lodash";
import HttpKit from "../../utilities/helper/HttpKit";
import ApiKit from "../../utilities/helper/ApiKit";
import ErrorText from "../Typo/ErrorText";
import ButtonLoader from "../../shared/ButtonLoader";
import { toastError, toastSuccess } from "../../shared/toastHelper";

function AssignSupervisor({ init = () => {}, data = {}, onClose = () => {} }) {
  const [supervisors, setSupervisors] = useState([]);
  const [formData, setFormData] = useState({ supervisor: "" });
  const [error, setError] = useState({ supervisor: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const payload = {
      electrician_id: get(data, "id", ""),
      supervisor_id: get(formData, "supervisor.id", ""),
    };

    const onSuccess = (response) => {
      toastSuccess({ message: "Supervisor assigned successfully" });
      init();
      setError((prev) => ({ ...prev, supervisor: "" }));
      onClose();
    };

    const onError = (error) => {
      const message = get(
        error,
        "response.data.message",
        "Something went wrong"
      );
      toastError({ message: message });
      setError((prev) => ({ ...prev, supervisor: message }));
    };

    ApiKit.supervisors
      .postAssignSupervisor(payload)
      .then(onSuccess)
      .catch(onError)
      .finally(() => {
        setLoading(false);
      });
  };

  const electricianName = get(data, "name", "");

  const getOptionsData = useCallback(({ params = {}, api, additional }) => {
    const previous = get(additional, "data.previous", "");
    const next = get(additional, "data.next", "");
    const hasPrevious = Boolean(previous);
    const hasNext = Boolean(next);
    let hasMore = false;

    const onSuccess = (response) => {
      const data = get(response, "data", {});
      const _hasNext = get(data, "next", "");
      const options = [...data];
      setSupervisors((prevOptions) => [...prevOptions, ...options]);
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

  const loadSupervisors = (inputValue, prevOptions, additional) => {
    return getOptionsData({
      params: inputValue ? { keyword: inputValue } : {},
      name: "supervisors",
      api: ApiKit.supervisors.getSupervisors,
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

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">
        Assign Supervisor for{" "}
        <span className="uppercase text-blue-900">{electricianName}</span>
      </h1>
      <form onSubmit={handleRegister}>
        <label>Supervisor Name</label>
        <Select
          type={ASYNC_SELECT}
          cacheOptions
          defaultOptions
          loadOptions={loadSupervisors}
          value={getSelectValue(supervisors, formData.supervisor)}
          getOptionLabel={(option) => {
            return `${get(option, "name", "")} - ${get(option, "email", "")}`;
          }}
          getSelectedOptionLabel={(option) => {
            return `${get(option, "name", "")} - ${get(option, "email", "")}`;
          }}
          getOptionValue={(option) => get(option, "id", "")}
          placeholder={"Select Role"}
          onChange={(items) => {
            setFormData({ ...formData, supervisor: items });
            setError((prev) => ({ ...prev, supervisor: "" }));
          }}
        />
        <ErrorText error={error.supervisor} />
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
              <span>Assign</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssignSupervisor;
