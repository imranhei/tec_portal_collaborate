import React, { useEffect, useState } from "react";
import { get, isEmpty } from "lodash";
import ApiKit from "../utilities/helper/ApiKit";

function TableData({
  isView = false,
  arrayCount = 5,
  colorGray = false,
  workedHour = [],
  setWorkedHour = () => {},
  startTime = {},
  setStartTime = () => {},
  finishTime = {},
  setFinishedTime = () => {},
  type = "normal",
}) {
  const [job_name, setJob_name] = useState("");
  const [index, setIndex] = useState("");
  const [jobSheetOptions, setJobSheetOptions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState({
    index: null,
    type: null,
  });

  const callJobSheet = (paginate) => {
    const params = { page: paginate };
    const onSuccess = (response) => {
      const data = get(response, "data", {});
      const options = get(data, "data", []);
      //       get unique options from the response compare to the previous options
      const uniqueOptions = options.filter((option) => {
        return !jobSheetOptions.some((prevOption) => {
          return prevOption.id === option.id;
        });
      });
      setJobSheetOptions((prevJobSheetOptions) => [
        ...prevJobSheetOptions,
        ...uniqueOptions,
      ]);
    };

    const onError = (error) => {
      // errorHelper(error, t);
    };

    ApiKit.jobSheet
      .getJobSheet(paginate && params)
      .then(onSuccess)
      .catch(onError);
  };

  useEffect(() => {
    callJobSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updatedData = [...workedHour];
    updatedData[index] = {
      ...updatedData[index],
      job_name: job_name,
    };
    setWorkedHour(updatedData);

    setJob_name("");
    setIndex("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job_name]);

  const ignoreFloatValue = (value) => {
    if (value) {
      return value.toString().split(".")[0];
    }
    return value;
  };

  const grandTotal = (data) => {
    // validate if data is not empty
    if (data) {
      const { wed, thu, fri, sat, sun, mon, tue } = data;
      return (
        Number(wed || 0) +
        Number(thu || 0) +
        Number(fri || 0) +
        Number(sat || 0) +
        Number(sun || 0) +
        Number(mon || 0) +
        Number(tue || 0)
      );
    }
    return 0;
  };

  const onSelectDropdown = () => {
    setFocusedIndex({ index: null, type: null });
  };

  return (
    <div>
      <table className="w-full h-full break-words mt-4">
        <thead>
          <tr className="grid grid-cols-[2fr_4fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-b-0">
            <th className="border border-black flex items-center justify-center">
              JOB NO
            </th>
            <th className="border border-black break-all flex items-center justify-center">
              JOB NAME & DESCRIPTION
            </th>
            <th className="border border-black break-all flex items-center justify-center">
              36 HR WK
            </th>
            <th className="border border-black flex items-center justify-center">
              WED
            </th>
            <th className="border border-black flex items-center justify-center">
              THU
            </th>
            <th className="border border-black flex items-center justify-center">
              FRI
            </th>
            <th
              className={`border border-black flex items-center justify-center ${
                colorGray ? "bg-gray-400" : ""
              }`}
            >
              SAT
            </th>
            <th
              className={`border border-black flex items-center justify-center ${
                colorGray ? "bg-gray-400" : ""
              }`}
            >
              SUN
            </th>
            <th className="border border-black flex items-center justify-center">
              MON
            </th>
            <th className="border border-black flex items-center justify-center">
              TUE
            </th>
            <th className="border border-black flex items-center justify-center">
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: arrayCount }).map((_, index) => {
            return (
              <tr
                className="grid grid-cols-[2fr_4fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b"
                key={index}
              >
                <td className="border border-black">
                  <input
                    disabled={isView}
                    onFocus={() => setFocusedIndex({ index, type })}
                    type="text"
                    className="w-full h-full text-center outline-none relative"
                    value={ignoreFloatValue(workedHour[index]?.job_no) || ""}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        job_no: e.target.value,
                      };
                      setWorkedHour(updatedData);
                      setIndex(index);
                      onSelectDropdown();
                    }}
                  />
                  {!isEmpty(jobSheetOptions) &&
                    focusedIndex.index === index &&
                    type === focusedIndex.type && (
                      <div className="flex z-10 absolute cursor-pointer select-none rounded-md text-accent justify-end gap-1 flex-col items-end bg-gray-300 p-2 px-3">
                        {jobSheetOptions.map((item, indexJ) => (
                          <div
                            key={index}
                            onClick={() => {
                              const updatedData = [...workedHour];
                              updatedData[index] = {
                                ...updatedData[index],
                                job_no: item?.job_no,
                                job_name: item?.performed,
                              };
                              setWorkedHour(updatedData);
                              onSelectDropdown();
                            }}
                            className={`hover:bg-gray-200 dark:hover:bg-selectedOptionBg cursor-pointer w-full rounded-sm p-1 px-4 text-xs`}
                          >
                            {item?.job_no}
                          </div>
                        ))}
                      </div>
                    )}
                </td>
                {/* <div></div> */}
                <td onClick={onSelectDropdown} className="border border-black">
                  <div>
                    <input
                      disabled={isView}
                      type="text"
                      className={`w-full h-auto text-xs overflow-hidden outline-none print:resize-none ${
                        isView && "resize-none"
                      }`}
                      value={workedHour[index]?.job_name || ""}
                      onChange={(e) => {
                        const updatedData = [...workedHour];
                        updatedData[index] = {
                          ...updatedData[index],
                          job_name: e.target.value,
                        };
                        setWorkedHour(updatedData);
                      }}
                    />
                    {}
                  </div>
                </td>
                <td
                  onClick={onSelectDropdown}
                  className="border border-black w-full h-full flex items-center justify-center"
                >
                  <input
                    //     disabled={isView}
                    type="checkbox"
                    className="w-full accent-teal-600 outline-none"
                    checked={workedHour[index]?.hr_36_wk ? true : false}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        hr_36_wk: e.target.checked,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td onClick={onSelectDropdown} className="border border-black">
                  <input
                    disabled={isView}
                    type="number"
                    className="w-full h-full text-center outline-none"
                    value={workedHour[index]?.wed || ""}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        wed: e.target.value,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td onClick={onSelectDropdown} className="border border-black">
                  <input
                    disabled={isView}
                    type="number"
                    className="w-full h-full text-center outline-none"
                    value={workedHour[index]?.thu || ""}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        thu: e.target.value,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td onClick={onSelectDropdown} className="border border-black">
                  <input
                    disabled={isView}
                    type="number"
                    className="w-full h-full text-center outline-none"
                    value={workedHour[index]?.fri || ""}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        fri: e.target.value,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td
                  onClick={onSelectDropdown}
                  className={`border border-black`}
                >
                  <input
                    type="number"
                    className={`${
                      colorGray ? "bg-gray-400 h-full" : ""
                    } w-full h-full text-center outline-none`}
                    value={workedHour[index]?.sat || ""}
                    disabled={isView}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        sat: e.target.value,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td
                  onClick={onSelectDropdown}
                  className={`border border-black`}
                >
                  <input
                    type="number"
                    className={`${
                      colorGray ? "bg-gray-400 h-full" : ""
                    } w-full h-full text-center outline-none`}
                    value={workedHour[index]?.sun || ""}
                    disabled={isView}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        sun: e.target.value,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td onClick={onSelectDropdown} className="border border-black">
                  <input
                    disabled={isView}
                    type="number"
                    className="w-full h-full text-center outline-none"
                    value={workedHour[index]?.mon || ""}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        mon: e.target.value,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td onClick={onSelectDropdown} className="border border-black">
                  <input
                    disabled={isView}
                    type="number"
                    className="w-full h-full text-center outline-none"
                    value={workedHour[index]?.tue || ""}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        tue: e.target.value,
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
                <td onClick={onSelectDropdown} className="border border-black">
                  <input
                    type="number"
                    disabled
                    className="w-full h-full text-center outline-none cursor-not-allowed"
                    value={
                      workedHour[index]?.total
                        ? workedHour[index]?.total
                        : grandTotal(workedHour[index]) || ""
                    }
                    onFocus={() => {
                      const total = grandTotal(workedHour[index]);
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        total: total || 0,
                      };
                      setWorkedHour(updatedData);
                    }}
                    onChange={(e) => {
                      const updatedData = [...workedHour];
                      updatedData[index] = {
                        ...updatedData[index],
                        total: e.target.value
                          ? e.target.value
                          : grandTotal(workedHour[index]) || "",
                      };
                      setWorkedHour(updatedData);
                    }}
                  />
                </td>
              </tr>
            );
          })}
          <tr
            onClick={onSelectDropdown}
            className="grid grid-cols-[6.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b"
          >
            <td className="border border-black">
              <span className="font-bold uppercase flex justify-end pr-4">
                START TIME:
              </span>
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={startTime?.wed || ""}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    wed: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={startTime?.thu || ""}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    thu: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={startTime?.fri || ""}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    fri: e.target.value,
                  })
                }
              />
            </td>
            <td className={`border border-black`}>
              <input
                type="text"
                className={`${
                  colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                } w-full h-full text-center outline-none`}
                value={startTime?.sat || ""}
                disabled={colorGray || isView}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    sat: e.target.value,
                  })
                }
              />
            </td>
            <td className={`border border-black`}>
              <input
                type="text"
                className={`${
                  colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                } w-full h-full text-center outline-none`}
                value={startTime?.sun || ""}
                disabled={colorGray || isView}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    sun: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={startTime?.mon || ""}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    mon: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={startTime?.tue || ""}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    tue: e.target.value,
                  })
                }
              />
            </td>
            <td className={`border border-black`}>
              <input
                type="text"
                className={`${
                  colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                } w-full h-full text-center outline-none`}
                value={startTime?.total || ""}
                disabled={colorGray || isView}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    total: e.target.value,
                  })
                }
              />
            </td>
          </tr>
          <tr
            onClick={onSelectDropdown}
            className="grid grid-cols-[6.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b"
          >
            <td className="border border-black">
              <span className="font-bold uppercase flex justify-end pr-4">
                FINISH TIME:
              </span>
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={finishTime?.wed || ""}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    wed: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={finishTime?.thu || ""}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    thu: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={finishTime?.fri || ""}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    fri: e.target.value,
                  })
                }
              />
            </td>
            <td className={`border border-black`}>
              <input
                type="text"
                className={`${
                  colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                } w-full h-full text-center outline-none`}
                value={finishTime?.sat || ""}
                disabled={colorGray || isView}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    sat: e.target.value,
                  })
                }
              />
            </td>
            <td className={`border border-black`}>
              <input
                type="text"
                className={`${
                  colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                } w-full h-full text-center outline-none`}
                value={finishTime?.sun || ""}
                disabled={colorGray || isView}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    sun: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={finishTime?.mon || ""}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    mon: e.target.value,
                  })
                }
              />
            </td>
            <td className="border border-black">
              <input
                disabled={isView}
                type="text"
                className="w-full h-full outline-none text-center"
                value={finishTime?.tue || ""}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    tue: e.target.value,
                  })
                }
              />
            </td>
            <td className={`border border-black`}>
              <input
                type="text"
                className={`${
                  colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                } w-full h-full text-center outline-none`}
                value={finishTime?.total || ""}
                disabled={colorGray || isView}
                onChange={(e) =>
                  setFinishedTime({
                    ...finishTime,
                    total: e.target.value,
                  })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableData;
