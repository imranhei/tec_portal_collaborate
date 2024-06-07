import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { get, isEqual } from "lodash";
import { FaEdit, FaHistory } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";

import { toastError } from "../shared/toastHelper";
import { getFormattedDate } from "../utilities/dateHelper";
import ApiKit from "../utilities/helper/ApiKit";
import { LIST_DATA_DATE_FORMAT } from "../common/constant";
import Modal from "./modal/Modal";
import List from "../shared/List";
import TimeSheetHistory from "./History/TimeSheetHistory";
import ListSkeleton from "../shared/ListSkeleton";
import { useReactToPrint } from "react-to-print";

const DISPLAY = {
  title: () => "Time Sheet",
  content: {
    properties: [
      "employee_name",
      "employee_no",
      "week_ending",
      "normal_time",
      "over_time",
      "signature",
      "approved",
      "status",
      "revision_count",
      "action",
    ],
    headerClass: {},
    bodyClass: {},
    style: {
      columnWidth:
        "md:grid-cols-[0.5fr_1.5fr_1fr_1.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]", // 1st 1fr for "SL" (if autoSerialNumber true)
      printColumnWidth:
        "print:grid-cols-[0.5fr_1.5fr_1fr_1.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]", // 1st 1fr for "SL" (if autoSerialNumber true)
    },
    header: () => {
      return {
        employee_name: "Employee Name",
        employee_no: "Employee No",
        week_ending: "Week Ending",
        normal_time: "Normal Time",
        over_time: "Over Time",
        signature: "Signature",
        approved: "Approved",
        status: "Status",
        revision_count: "Revision Count",
        action: "Action",
      };
    },
    body: ({
      row,
      column,
      navigate,
      onCheckHistory,
      setIsHistoryModalOpen,
    }) => {
      if (column === "week_ending") {
        const weekEnding = get(row, "week_ending", "");
        return weekEnding
          ? getFormattedDate(weekEnding, LIST_DATA_DATE_FORMAT)
          : "-";
      }

      if (column === "normal_time") {
        const normalTime = get(row, "normal_time", []);
        const normalTimeLength = normalTime?.length;
        return normalTimeLength ? normalTimeLength : "-";
      }

      if (column === "over_time") {
        const overTime = get(row, "over_time", []);
        const overTimeLength = overTime?.length;
        return overTimeLength ? overTimeLength : "-";
      }

      if (column === "signature") {
        const signature = get(row, "signature", "");
        return signature ? signature : "-";
      }

      if (column === "approved") {
        const approved = get(row, "approved", "");
        return approved ? approved : "-";
      }

      if (column === "status") {
        const status = get(row, "status", "");
        return status ? status : "-";
      }

      if (column === "revision_count") {
        const revisionCount = get(row, "revision_count", 0);
        return (
          <span
            className={`${
              revisionCount ? "text-linkText cursor-pointer select-none" : ""
            }`}
            onClick={() => {
              if (revisionCount) {
                setIsHistoryModalOpen(true);
                onCheckHistory(get(row, "id", ""));
              }
            }}
          >
            {revisionCount ? `${revisionCount} time` : "No Revision"}
          </span>
        );
      }

      if (column === "action") {
        return (
          <p className="flex gap-2">
            <Tooltip title="Details">
              <p>
                <BsEyeFill
                  className="cursor-pointer"
                  onClick={() =>
                    navigate("/addtimesheet", { state: { row, view: true } })
                  }
                  size={18}
                />
              </p>
            </Tooltip>
            <Tooltip title="Edit">
              <p className="cursor-pointer">
                <FaEdit
                  onClick={() =>
                    navigate("/addtimesheet", {
                      state: { row, view: false, edit: true },
                    })
                  }
                  size={18}
                />
              </p>
            </Tooltip>
          </p>
        );
      }

      const typeOfData = typeof row[column];
      return typeOfData === "string"
        ? row[column]
          ? row[column]
          : "-"
        : typeOfData === "number"
        ? row[column]
        : "-";
    },
    contextMenu: ({ row, navigate, setIsHistoryModalOpen, onCheckHistory }) => {
      const revisionCount = get(row, "revision_count", 0);
      return [
        {
          icon: <AiOutlineInfoCircle size={18} />,
          name: "Details",
          function: () =>
            navigate("/addtimesheet", { state: { row, view: true } }),
        },
        {
          icon: <FaHistory size={18} />,
          name: "Revision History",
          function: () => {
            if (revisionCount) {
              setIsHistoryModalOpen(true);
              onCheckHistory(get(row, "id", ""));
            }
          },
        },
        {
          icon: <FaEdit size={18} />,
          name: "Edit",
          function: () =>
            navigate("/addtimesheet", {
              state: { row, view: false, edit: true },
            }),
        },
      ];
    },
    customColumnClassNames: [
      {
        property: "action",
        className: "md:text-right flex justify-end",
      },
    ],
  },
};

function TimeSheet() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState({});
  const [timeSheetData, setTimeSheetData] = useState({});
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const printFunctionRef = useRef(null);
  const currentParamsOfApiCallRef = useRef(null);

  const latestHistoryData = get(historyData, "timeSheet", {});
  const historyDataArray = get(historyData, "history", []);

  const navigate = useNavigate();

  const title = DISPLAY.title();

  const onChangePharmacy = (data) => {
    setTimeSheetData(data);
    setIsLoading(false);
  };
  const callTimeSheetApi = (params = "", search = false) => {
    if (params.key) {
      params = { ...params, keyword: params.key };
      delete params.key;
    }
    currentParamsOfApiCallRef.current = params;
    const onSuccess = (response) => {
      const data = get(response, "data", "");
      const responseParams = get(response, "config.params", {});
      if (isEqual(responseParams, currentParamsOfApiCallRef.current)) {
        onChangePharmacy(data);
      }
    };
    const onError = (error) => {
      console.warn(error);
    };
    const onFinally = () => {
      setIsLoading(false);
    };
    let url = ApiKit.timeSheet.getTimeSheets(params);
    url.then(onSuccess).catch(onError).finally(onFinally);
  };

  const onCheckHistory = (id) => {
    setIsHistoryLoading(true);
    const onSuccess = (response) => {
      const data = get(response, "data", "");
      setHistoryData(data);
    };
    const onError = (error) => {
      toastError({
        message: error.message ? error.message : "Something went wrong",
      });
    };
    const onFinally = () => {
      setIsHistoryLoading(false);
    };
    ApiKit.timeSheet
      .getTimeSheetHistory(id)
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);
  };

  const onCloseHistory = () => {
    setIsHistoryModalOpen(false);
    setHistoryData({});
  };

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const init = () => {
    setIsLoading(true);
    callTimeSheetApi();
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="print:static flex flex-col md:flex-row gap-4 justify-between top-16 px-4 print:px-0 py-4 border-y border-borderColor drop-shadow-md font-bold text-2xl uppercase print:capitalize text-left bg-default text-accent print:grid print:gap-x-3 print:bg-white print:font-bold print:border-b-2 print:border-t-2 print:py-1 print:my-2 print:border-y-0 print:border-b-black print:border-t-black print:drop-shadow-none print:text-black">
        {title ? title : ""}
        <div className="flex flex-col md:flex-row gap-4">
          <Tooltip title="Add Time Sheet">
            <button
              onClick={() => navigate("/addtimesheet")}
              className="print:hidden bg-blue-600 p-1 rounded-full hover:bg-linkText text-white"
            >
              <MdAdd size={28} />
            </button>
          </Tooltip>
        </div>
      </div>
      <List
        printFunctionRef={printFunctionRef}
        title={title}
        loading={isLoading}
        data={timeSheetData}
        renderDropdownItem={"true"}
        contextMenuData={({ row }) =>
          DISPLAY.content.contextMenu({
            row,
            navigate,
            setIsHistoryModalOpen,
            onCheckHistory,
          })
        }
        onChangeData={onChangePharmacy}
        properties={DISPLAY.content.properties}
        header={DISPLAY.content.header()}
        body={({ row, column }) =>
          DISPLAY.content.body({
            row,
            column,
            navigate,
            onCheckHistory,
            setIsHistoryModalOpen,
          })
        }
        style={DISPLAY.content.style}
        customColumnClassNames={DISPLAY.content.customColumnClassNames}
        callApi={init}
      />
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={onCloseHistory}
        title="Time Sheet History"
        size="xxl"
      >
        <div className="flex flex-col gap-4">
          {isHistoryLoading ? (
            <>
              <ListSkeleton rows={20} />
            </>
          ) : (
            <div ref={printRef}>
              <div className="flex justify-between gap-4">
                <p className="text-xl font-bold bg-teal-400 rounded-md px-2 w-fit">
                  Latest Revision
                </p>
                <p
                  className="text-xl font-bold print:hidden bg-teal-400 hover:bg-teal-500 rounded-md px-2 w-fit cursor-pointer"
                  onClick={handlePrint}
                >
                  Print
                </p>
              </div>
              <div className="">
                <div className="print:break-after-page">
                  <TimeSheetHistory data={latestHistoryData} isView={true} />
                </div>
                {Array.isArray(historyDataArray) &&
                  historyDataArray?.map((history, index) => (
                    <div className="print:break-after-page" key={index}>
                      <hr className="print:hidden" />
                      <h1 className="text-xl font-bold bg-teal-400 rounded-lg px-2 w-fit mt-1">
                        Revision Count: {index + 1}
                      </h1>
                      <TimeSheetHistory data={history} isView={true} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
export default TimeSheet;
