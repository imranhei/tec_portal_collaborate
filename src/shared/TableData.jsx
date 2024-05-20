import React from "react";

function TableData({
  arrayCount = 5,
  colorGray = false,
  workedHour,
  setWorkedHour,
  startTime,
  setStartTime,
  finishTime,
  setFinishedTime,
}) {
  const grandTotal = (data) => {
    // validate if data is not empty
    if (data) {
      const { wed, thu, fri, sat, sun, mon, tue } = data;
      return (
        parseInt(wed || 0) +
        parseInt(thu || 0) +
        parseInt(fri || 0) +
        parseInt(sat || 0) +
        parseInt(sun || 0) +
        parseInt(mon || 0) +
        parseInt(tue || 0)
      );
    }
    return 0;
  };
  return (
    <div>
      <table className="w-full break-words mt-4">
        <thead>
          <tr className="grid grid-cols-[1.5fr_3fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-b-0">
            <th className="border border-black flex items-center justify-center">
              JOB NO
            </th>
            <th className="border border-black flex items-center justify-center">
              JOB NAME & DESCRIPTION
            </th>
            <th className="border border-black flex items-center justify-center">
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
          {Array.from({ length: arrayCount }).map((_, index) => (
            <tr
              className="grid grid-cols-[1.5fr_3fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b"
              key={index}
            >
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full text-center outline-none"
                  value={workedHour[index]?.job_no || ""}
                  onChange={(e) => {
                    const updatedData = [...workedHour];
                    updatedData[index] = {
                      ...updatedData[index],
                      job_no: e.target.value,
                    };
                    setWorkedHour(updatedData);
                  }}
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none"
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
              </td>
              <td className="border border-black">
                <input
                  type="checkbox"
                  className="w-full outline-none"
                  value={workedHour[index]?.hr_36_wk || ""}
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
              <td className="border border-black">
                <input
                  type="number"
                  className="w-full text-center outline-none"
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
              <td className="border border-black">
                <input
                  type="number"
                  className="w-full text-center outline-none"
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
              <td className="border border-black">
                <input
                  type="number"
                  className="w-full text-center outline-none"
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
              <td className={`border border-black`}>
                <input
                  type="number"
                  className={`${
                    colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                  } w-full text-center outline-none`}
                  value={workedHour[index]?.sat || ""}
                  disabled={colorGray}
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
              <td className={`border border-black`}>
                <input
                  type="number"
                  className={`${
                    colorGray ? "bg-gray-400 cursor-not-allowed" : ""
                  } w-full text-center outline-none`}
                  value={workedHour[index]?.sun || ""}
                  disabled={colorGray}
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
              <td className="border border-black">
                <input
                  type="number"
                  className="w-full text-center outline-none"
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
              <td className="border border-black">
                <input
                  type="number"
                  className="w-full text-center outline-none"
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
              <td className="border border-black">
                <input
                  type="number"
                  className="w-full text-center outline-none"
                  value={grandTotal(workedHour[index]) || ""}
                  onChange={(e) => {
                    const updatedData = [...workedHour];
                    updatedData[index] = {
                      ...updatedData[index],
                      total: e.target.value,
                    };
                    setWorkedHour(updatedData);
                  }}
                />
              </td>
            </tr>
          ))}
          <tr className="grid grid-cols-[5.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b">
            <td className="border border-black">
              <span className="font-bold uppercase flex justify-end pr-4">
                START TIME:
              </span>
            </td>
            <td className="border border-black">
              <input
                type="text"
                className="w-full outline-none text-center"
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
                type="text"
                className="w-full outline-none text-center"
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
                type="text"
                className="w-full outline-none text-center"
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
                } w-full text-center outline-none`}
                value={startTime?.sat || ""}
                disabled={colorGray}
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
                } w-full text-center outline-none`}
                value={startTime?.sun || ""}
                disabled={colorGray}
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
                type="text"
                className="w-full outline-none text-center"
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
                type="text"
                className="w-full outline-none text-center"
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
                } w-full text-center outline-none`}
                value={grandTotal(startTime) || ""}
                disabled={colorGray}
                onChange={(e) =>
                  setStartTime({
                    ...startTime,
                    total: e.target.value,
                  })
                }
              />
            </td>
          </tr>
          <tr className="grid grid-cols-[5.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b">
            <td className="border border-black">
              <span className="font-bold uppercase flex justify-end pr-4">
                FINISH TIME:
              </span>
            </td>
            <td className="border border-black">
              <input
                type="text"
                className="w-full outline-none text-center"
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
                type="text"
                className="w-full outline-none text-center"
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
                type="text"
                className="w-full outline-none text-center"
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
                } w-full text-center outline-none`}
                value={finishTime?.sat || ""}
                disabled={colorGray}
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
                } w-full text-center outline-none`}
                value={finishTime?.sun || ""}
                disabled={colorGray}
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
                type="text"
                className="w-full outline-none text-center"
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
                type="text"
                className="w-full outline-none text-center"
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
                } w-full text-center outline-none`}
                value={grandTotal(finishTime) || ""}
                disabled={colorGray}
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
