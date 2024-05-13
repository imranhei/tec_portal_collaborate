import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const initialTimeData = [
  {
    job_no: "",
    job_name: "",
    hr_36_wk: "",
    wed: "",
    thu: "",
    fri: "",
    sat: "",
    sun: "",
    mon: "",
    tue: "",
    total: "",
  },
];

const initialStartFinishTime = {
  wed: "",
  thu: "",
  fri: "",
  sat: "",
  sun: "",
  mon: "",
  tue: "",
  total: "",
};

const initialData = {
  employee_name: "",
  employee_no: "",
  week_ending: "",
  normal_time: [...initialTimeData],
  over_time: [...initialTimeData],
  normal_time_start_time: { ...initialStartFinishTime },
  normal_time_finish_time: { ...initialStartFinishTime },
  over_time_start_time: { ...initialStartFinishTime },
  over_time_finish_time: { ...initialStartFinishTime },
  hours_ordinary_time: "",
  hours_overtime_1_5: "",
  hours_overtime_2: "",
  hours_overtime_2_5: "",
  hours_night_shift: "",
  hours_productivity_allowance: "",
  hours_site_allowance: "",
  hours_travel_time: "",
  hours_rdo: "",
  hours_public_holiday: "",
  hours_annual_leave: "",
  hours_sick_pay: "",
  hours_tafe: "",
  meals: "",
  living_away_from_home_allowance: "",
  special_allowances: "",
  signature: "",
  approved: "",
  revision_count: 0,
  created_by: "",
};

function TimeSheet() {
  const [data, setData] = useState({ ...initialData });
  const [normalTime, setNormalTime] = useState([...initialTimeData]);
  const [overTime, setOverTime] = useState([...initialTimeData]);
  const [normalTimeStartTime, setNormalTimeStartTime] = useState({
    ...initialStartFinishTime,
  });
  const [normalTimeFinishTime, setNormalTimeFinishTime] = useState({
    ...initialStartFinishTime,
  });
  const [overTimeStartTime, setOverTimeStartTime] = useState({
    ...initialStartFinishTime,
  });
  const [overTimeFinishTime, setOverTimeFinishTime] = useState({
    ...initialStartFinishTime,
  });

  // const [approved, setApproved] = useState(false);

  const handleFormSubmit = () => {
    console.log(data);
  };

  const normalTimeRowCount = 10;
  const overTimeRowCount = 5;
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="text-sm">
      <div ref={printRef} className="relative">
        <h1 className="absolute left-20 bg-gray-800 font-extrabold text-4xl text-white font-serif tracking-wider p-1 px-5">
          TEC
        </h1>
        <div className="text-center text-2xl pt-4 font-medium">
          <h1>
            <span>Time</span>
            <span>sheet</span>
          </h1>
        </div>
        {/* employee info input fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 print:grid-cols-3 mt-8">
          <div className="flex items-center">
            <p>Employee Name: </p>
            <input
              type="text"
              value={data?.employee_name || ""}
              list="timeSheet"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
              onChange={(e) =>
                setData({ ...data, employee_name: e.target.value })
              }
              //   disabled={!approved}
            />
          </div>
          <div className="flex items-center">
            <p>Employee No: </p>
            <input
              type="text"
              value={data?.employee_no || ""}
              list="store"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
              onChange={(e) =>
                setData({ ...data, employee_no: e.target.value })
              }
              //   disabled={!approved}
            />
          </div>
          <div className="flex items-center">
            <p>Week Ending: </p>
            <input
              value={data?.week_ending || ""}
              type="date"
              className={`border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white ${
                data?.date ? "" : "opacity-50"
              }`}
              onChange={(e) =>
                setData({ ...data, week_ending: e.target.value })
              }
              //   disabled={!approved}
            />
          </div>
        </div>
        {/* normal time header */}
        <h1 className="text-xl font-semibold text-center mt-4">
          <span className="border-b-2 border-black uppercase">Normal Time</span>
        </h1>
        {/* normal time table */}
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
              <th className="border border-black bg-gray-400 flex items-center justify-center">
                SAT
              </th>
              <th className="border border-black bg-gray-400 flex items-center justify-center">
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
            {
              // normal time rows
              Array.from({ length: normalTimeRowCount }).map((_, index) => (
                <tr
                  className="grid grid-cols-[1.5fr_3fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b"
                  key={index}
                >
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center"
                      value={normalTime[index]?.job_no || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].job_no = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none"
                      value={normalTime[index]?.job_name || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].job_name = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="checkbox"
                      className="w-full outline-none"
                      value={normalTime[index]?.hr_36_wk || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].hr_36_wk = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center"
                      value={normalTime[index]?.wed || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].wed = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center"
                      value={normalTime[index]?.thu || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].thu = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center"
                      value={normalTime[index]?.fri || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].fri = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center bg-gray-400"
                      value={normalTime[index]?.sat || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].sat = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center bg-gray-400"
                      value={normalTime[index]?.sun || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].sun = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center"
                      value={normalTime[index]?.mon || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].mon = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center"
                      value={normalTime[index]?.tue || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].tue = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none text-center"
                      value={normalTime[index]?.total || ""}
                      onChange={(e) => {
                        const updatedData = [...normalTime];
                        updatedData[index].total = e.target.value;
                        setNormalTime(updatedData);
                      }}
                    />
                  </td>
                </tr>
              ))
            }
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
                  value={normalTimeStartTime?.wed || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
                      wed: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeStartTime?.thu || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
                      thu: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeStartTime?.fri || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
                      fri: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center bg-gray-400"
                  value={normalTimeStartTime?.sat || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
                      sat: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center bg-gray-400"
                  value={normalTimeStartTime?.sun || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
                      sun: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeStartTime?.mon || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
                      mon: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeStartTime?.tue || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
                      tue: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center bg-gray-400"
                  value={normalTimeStartTime?.total || ""}
                  onChange={(e) =>
                    setNormalTimeStartTime({
                      ...normalTimeStartTime,
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
                  value={normalTimeFinishTime?.wed || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      wed: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeFinishTime?.thu || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      thu: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeFinishTime?.fri || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      fri: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center bg-gray-400"
                  value={normalTimeFinishTime?.sat || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      sat: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center bg-gray-400"
                  value={normalTimeFinishTime?.sun || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      sun: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeFinishTime?.mon || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      mon: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={normalTimeFinishTime?.tue || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      tue: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center bg-gray-400"
                  value={normalTimeFinishTime?.total || ""}
                  onChange={(e) =>
                    setNormalTimeFinishTime({
                      ...normalTimeFinishTime,
                      total: e.target.value,
                    })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
        <h1 className="text-xl font-semibold text-center mt-4">
          <span className="border-b-2 border-black uppercase">Over-Time</span>
        </h1>
        {/* over time table */}
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
              <th className="border border-black flex items-center justify-center">
                SAT
              </th>
              <th className="border border-black flex items-center justify-center">
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
            {
              // over time rows
              Array.from({ length: overTimeRowCount }).map((_, index) => (
                <tr
                  className="grid grid-cols-[1.5fr_3fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.2fr] border border-black border-y-0 last:border-b"
                  key={index}
                >
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.job_no || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].job_no = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="text"
                      className="w-full outline-none"
                      value={overTime[index]?.job_name || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].job_name = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="checkbox"
                      className="w-full outline-none"
                      value={overTime[index]?.hr_36_wk || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].hr_36_wk = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.wed || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].wed = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.thu || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].thu = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.fri || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].fri = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.sat || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].sat = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.sun || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].sun = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.mon || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].mon = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.tue || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].tue = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                  <td className="border border-black">
                    <input
                      type="number"
                      className="w-full text-center outline-none"
                      value={overTime[index]?.total || ""}
                      onChange={(e) => {
                        const updatedData = [...overTime];
                        updatedData[index].total = e.target.value;
                        setOverTime(updatedData);
                      }}
                    />
                  </td>
                </tr>
              ))
            }
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
                  value={overTimeStartTime?.wed || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
                      wed: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeStartTime?.thu || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
                      thu: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeStartTime?.fri || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
                      fri: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeStartTime?.sat || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
                      sat: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeStartTime?.sun || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
                      sun: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeStartTime?.mon || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
                      mon: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeStartTime?.tue || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
                      tue: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeStartTime?.total || ""}
                  onChange={(e) =>
                    setOverTimeStartTime({
                      ...overTimeStartTime,
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
                  value={overTimeFinishTime?.wed || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      wed: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeFinishTime?.thu || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      thu: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeFinishTime?.fri || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      fri: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeFinishTime?.sat || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      sat: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeFinishTime?.sun || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      sun: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeFinishTime?.mon || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      mon: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeFinishTime?.tue || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      tue: e.target.value,
                    })
                  }
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  className="w-full outline-none text-center"
                  value={overTimeFinishTime?.total || ""}
                  onChange={(e) =>
                    setOverTimeFinishTime({
                      ...overTimeFinishTime,
                      total: e.target.value,
                    })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* extra field for work hours */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_ordinary_time || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_ordinary_time: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS ORDINARY TIME @ <span className="font-bold">X 1</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_overtime_1_5 || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_overtime_1_5: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS OVERTIME @ <span className="font-bold">X 1.5</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_overtime_2 || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_overtime_2: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS OVERTIME @ <span className="font-bold">X 2</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_overtime_2_5 || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_overtime_2_5: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS OVERTIME @ <span className="font-bold">X 2.5</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_night_shift || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_night_shift: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS NIGHT SHIFT @{" "}
                <span className="font-bold">X 1.5/ 1.3 / 1.25 / 1.15</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_productivity_allowance || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({
                    ...data,
                    hours_productivity_allowance: e.target.value,
                  })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS PRODUCTIVITY ALLOWANCE
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_site_allowance || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_site_allowance: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS SITE ALLOWANCE
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_travel_time || ""}
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_travel_time: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">HOURS TRAVEL TIME</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_rdo || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_rdo: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">HOURS R.D.O</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_public_holiday || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_public_holiday: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS PUBLIC HOLIDAY
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_annual_leave || ""}
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_annual_leave: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS ANNUAL LEAVE
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_sick_pay || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_sick_pay: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">HOURS SICK PAY</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_tafe || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_tafe: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">HOURS TAFE</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_meals || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({ ...data, hours_meals: e.target.value })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">MEALS</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={data?.hours_living_away_from_home_allowance || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
                onChange={(e) =>
                  setData({
                    ...data,
                    hours_living_away_from_home_allowance: e.target.value,
                  })
                }
                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                LIVING AWAY FROM HOME ALLOWANCE
              </p>
            </div>
          </div>
        </div>

        {/* special allowances */}
        <div className="mt-4">
          <p>SPECIAL ALLOWANCES / AMENDMENTS ETC:</p>
          <textarea
            className="w-full h-24 p-2 border-2 border-black outline-none"
            placeholder="Special allowances/amendments etc"
            value={data?.special_allowances || ""}
            onChange={(e) =>
              setData({ ...data, special_allowances: e.target.value })
            }
          />
        </div>

        {/* signature */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          <div className="flex items-center">
            <p className="uppercase">signature: </p>
            <input
              type="text"
              value={data?.signature || ""}
              list="signature"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
              onChange={(e) => setData({ ...data, signature: e.target.value })}
              //   disabled={!approved}
            />
          </div>
          <div className="flex items-center">
            <p className="uppercase">approved: </p>
            <input
              type="text"
              value={data?.approved || ""}
              list="approved"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
              onChange={(e) => setData({ ...data, approved: e.target.value })}
              //   disabled={!approved}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          className=" text-white mt-4 px-6 py-2 rounded-md bg-blue-600"
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          className="text-white mt-4 px-6 py-2 rounded-md bg-teal-600"
          onClick={() => handleFormSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default TimeSheet;
