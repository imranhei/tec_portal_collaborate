import React, { useRef } from "react";
import { get } from "lodash";
import { useReactToPrint } from "react-to-print";

import TableData from "../../shared/TableData";

function TimeSheetHistory({ data, isView = true }) {
  const normalTime = get(data, "normal_time", []);
  const overTime = get(data, "over_time", []);
  const normalTimeStartTime = get(data, "normal_time_start_time", []);
  const normalTimeFinishTime = get(data, "normal_time_finish_time", []);
  const overTimeStartTime = get(data, "over_time_start_time", []);
  const overTimeFinishTime = get(data, "over_time_finish_time", []);

  return (
    <div className="text-sm p-4">
      <div className="relative">
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
              disabled={isView}
              type="text"
              value={data?.employee_name || ""}
              list="store"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
            />
          </div>
          <div className="flex items-center">
            <p>Employee No: </p>
            <input
              disabled={isView}
              type="text"
              value={data?.employee_no || ""}
              list="store"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
            />
          </div>
          <div className="flex items-center">
            <p>Week Ending: </p>
            <input
              disabled={isView}
              value={data?.week_ending || ""}
              type="date"
              className={`border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white`}
            />
          </div>
        </div>
        {/* normal time header */}
        <h1 className="text-xl font-semibold text-center mt-4">
          <span className="border-b-2 border-black uppercase">Normal Time</span>
        </h1>
        {/* normal time table */}
        <TableData
          isView={true}
          arrayCount={10}
          colorGray={true}
          workedHour={normalTime}
          startTime={normalTimeStartTime}
          finishTime={normalTimeFinishTime}
        />
        <h1 className="text-xl font-semibold text-center mt-4">
          <span className="border-b-2 border-black uppercase">Over-Time</span>
        </h1>
        {/* over time table */}
        <TableData
          isView={true}
          arrayCount={5}
          colorGray={false}
          workedHour={overTime}
          startTime={overTimeStartTime}
          finishTime={overTimeFinishTime}
        />

        {/* extra field for work hours */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_ordinary_time || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">
                HOURS ORDINARY TIME @ <span className="font-bold">X 1</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_overtime_1_5 || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"

                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS OVERTIME @ <span className="font-bold">X 1.5</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_overtime_2 || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"

                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS OVERTIME @ <span className="font-bold">X 2</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_overtime_2_5 || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"

                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS OVERTIME @ <span className="font-bold">X 2.5</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_night_shift || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"

                //   disabled={!approved}
              />
              <p className="font-medium text-sm uppercase">
                HOURS NIGHT SHIFT @{" "}
                <span className="font-bold">X 1.5/ 1.3 / 1.25 / 1.15</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_productivity_allowance || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">
                HOURS PRODUCTIVITY ALLOWANCE
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_site_allowance || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">
                HOURS SITE ALLOWANCE
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_travel_time || ""}
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">HOURS TRAVEL TIME</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_rdo || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">HOURS R.D.O</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_public_holiday || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">
                HOURS PUBLIC HOLIDAY
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_annual_leave || ""}
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">
                HOURS ANNUAL LEAVE
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_sick_pay || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">HOURS SICK PAY</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_tafe || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">HOURS TAFE</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_meals || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
              />
              <p className="font-medium text-sm uppercase">MEALS</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                disabled={isView}
                type="text"
                value={data?.hours_living_away_from_home_allowance || ""}
                list="timeSheet"
                className="border-2 w-16 outline-none border-black rounded-sm bg-white"
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
            disabled={isView}
            className="w-full h-24 p-2 border-2 border-black outline-none"
            placeholder="Special allowances/amendments etc"
            value={data?.special_allowances || ""}
          />
        </div>

        {/* signature */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          <div className="flex items-center">
            <p className="uppercase">signature: </p>
            <input
              disabled={isView}
              type="text"
              value={data?.signature || ""}
              list="signature"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
            />
          </div>
          <div className="flex items-center">
            <p className="uppercase">approved: </p>
            <input
              disabled={isView}
              type="text"
              value={data?.approved || ""}
              list="approved"
              className="border-b border-dashed w-full border-b-gray-700 outline-none border-spacing-2 focus:border-b-black pl-2 flex-1 bg-white"
            />
          </div>
        </div>
      </div>
      {/* <div className="flex justify-center gap-4">
        <button
          className=" text-white mt-4 px-6 py-2 rounded-md bg-blue-600"
          onClick={handlePrint}
        >
          Print
        </button>
      </div> */}
    </div>
  );
}

export default TimeSheetHistory;
