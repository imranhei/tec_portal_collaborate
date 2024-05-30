import React, { useEffect, useRef, useState } from "react";
import List from "../shared/List";
import { get, isEqual } from "lodash";
import ApiKit from "../utilities/helper/ApiKit";
import { MdAdd } from "react-icons/md";
import { getFormattedDate } from "../utilities/dateHelper";
import { LIST_DATA_DATE_FORMAT } from "../common/constant";
import { BsEyeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Tooltip } from "@mui/material";
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
      "action",
    ],
    headerClass: {},
    bodyClass: {},
    style: {
      columnWidth: "md:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]", // 1st 1fr for "SL" (if autoSerialNumber true)
      printColumnWidth:
        "print:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]", // 1st 1fr for "SL" (if autoSerialNumber true)
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
        action: "Action",
      };
    },
    body: ({ row, column, navigate }) => {
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
            {/* <Tooltip title="Edit">
              <p className="cursor-pointer">
                <FaEdit
                  //   onClick={() =>
                  //     navigate("/addtimesheet", { state: { row, view: false } })
                  //   }
                  size={18}
                />
              </p>
            </Tooltip> */}
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
    contextMenu: ({ row, navigate }) => {
      return [
        {
          icon: <AiOutlineInfoCircle size={18} />,
          name: "Details",
          function: () =>
            navigate("/addtimesheet", { state: { row, view: true } }),
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
  const [productFormData, setProductFormData] = useState({});
  const printFunctionRef = useRef(null);
  const currentParamsOfApiCallRef = useRef(null);

  const navigate = useNavigate();

  const title = DISPLAY.title();
  const productFormResults = get(productFormData, "data", []);
  const hasListItems =
    Array.isArray(productFormResults) && productFormResults.length > 0;
  const onChangePharmacy = (data) => {
    setProductFormData(data);
    setIsLoading(false);
  };
  const callPharmacyApi = (params = "", search = false) => {
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
  const init = () => {
    setIsLoading(true);
    callPharmacyApi();
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
        data={productFormData}
        renderDropdownItem={"true"}
        contextMenuData={({ row }) =>
          DISPLAY.content.contextMenu({ row, navigate })
        }
        onChangeData={onChangePharmacy}
        properties={DISPLAY.content.properties}
        header={DISPLAY.content.header()}
        body={({ row, column }) =>
          DISPLAY.content.body({ row, column, navigate })
        }
        style={DISPLAY.content.style}
        customColumnClassNames={DISPLAY.content.customColumnClassNames}
        callApi={init}
      />
    </div>
  );
}
export default TimeSheet;
