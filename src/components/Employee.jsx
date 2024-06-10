import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Tooltip } from "@mui/material";
import { get, isEqual } from "lodash";
import { FaEdit } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdAdd, MdAssignmentInd, MdDelete, MdPrint } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

import ApiKit from "../utilities/helper/ApiKit";
import List from "../shared/List";
import Modal from "./modal/Modal";
import RegisterForm from "./Form/RegisterForm";
import { toastError, toastSuccess } from "../shared/toastHelper";
import AssignSupervisor from "./modal/AssignSupervisor";

const ContextFunctionList = {
  runDeleteFunction: (row, init) => {
    const removeOrder = () => {
      const onApiSuccess = (res) => {
        toastSuccess({ message: "Data Deleted Successfully" });
        init();
      };

      const onApiError = (err) => {
        toastError({ message: "Data Deletion Failed" });
      };

      ApiKit.user.deleteUser(row.id).then(onApiSuccess).catch(onApiError);
    };

    const onSuccess = (result) => {
      const isConfirmed = get(result, "isConfirmed", false);
      if (isConfirmed) removeOrder();
    };

    Swal.fire({
      title: `Are you sure?`,
      icon: "warning",
      text: "Do you want to delete this data?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(onSuccess);
  },
};

const DISPLAY = {
  title: () => "Employee",
  content: {
    properties: ["id", "employee_name", "email", "role", "action"],
    headerClass: {},
    bodyClass: {},
    style: {
      columnWidth: "md:grid-cols-[0.5fr_0.5fr_1.5fr_2fr_1fr_1fr]", // 1st 1fr for "SL" (if autoSerialNumber true)
      printColumnWidth: "print:grid-cols-[0.5fr_0.5fr_1.5fr_2fr_1fr]", // 1st 1fr for "SL" (if autoSerialNumber true)
    },
    header: () => {
      return {
        id: "Id",
        employee_name: "Employee Name",
        email: "Email",
        role: "Role",
        action: "Action",
      };
    },
    body: ({
      row,
      column,
      isSuperAdmin,
      init,
      setEditableData,
      setIsEditModalOpen,
      setIsAssignSupervisorModalOpen,
    }) => {
      if (column === "id") {
        const id = get(row, "id", "");
        return id ? id : "-";
      }

      if (column === "employee_name") {
        const employee_name = get(row, "name", "");
        return employee_name ? employee_name : "-";
      }

      if (column === "email") {
        const email = get(row, "email", "");
        return email ? email : "-";
      }

      if (column === "role") {
        const role = get(row, "roles", []);
        return Array.isArray(role) ? role.join(", ") : "-";
      }

      if (column === "action") {
        const role = get(row, "roles", []);
        const isElectrician = role?.includes("Electrician");
        return (
          <div className="flex gap-2">
            <Tooltip title="Edit">
              <p className="cursor-pointer">
                <FaEdit
                  onClick={() => {
                    setEditableData(row);
                    setIsEditModalOpen(true);
                  }}
                  size={18}
                />
              </p>
            </Tooltip>
            {isElectrician && (
              <Tooltip title="Assign Supervisor">
                <p className="cursor-pointer">
                  <MdAssignmentInd
                    onClick={() => {
                      setEditableData(row);
                      setIsAssignSupervisorModalOpen(true);
                    }}
                    size={18}
                  />
                </p>
              </Tooltip>
            )}
            {isSuperAdmin && (
              <Tooltip title="Delete">
                <p>
                  <MdDelete
                    className="cursor-pointer text-warning"
                    onClick={() =>
                      ContextFunctionList.runDeleteFunction(row, init)
                    }
                    size={20}
                  />
                </p>
              </Tooltip>
            )}
          </div>
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
    contextMenu: ({
      row,
      isSuperAdmin,
      init,
      setEditableData,
      setIsEditModalOpen,
      setIsAssignSupervisorModalOpen,
    }) => {
      return [
        {
          icon: <AiOutlineInfoCircle size={18} />,
          name: "Details",
          function: () => console.log("Details"),
        },
        {
          icon: <FaEdit size={18} />,
          name: "Edit",
          function: () => {
            setEditableData(row);
            setIsEditModalOpen(true);
          },
        },
        {
          icon: <MdAssignmentInd size={18} />,
          name: "Assign Supervisor",
          display: row.roles.includes("Electrician"),
          function: () => {
            setEditableData(row);
            setIsAssignSupervisorModalOpen(true);
          },
        },
        {
          icon: <MdDelete size={18} />,
          name: "Delete",
          display: isSuperAdmin,
          function: () => {
            ContextFunctionList.runDeleteFunction(row, init);
          },
        },
      ];
    },
    customColumnClassNames: [
      {
        property: "action",
        className: "md:text-right flex justify-end print:hidden",
      },
    ],
  },
};

function Employee() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignSupervisorModalOpen, setIsAssignSupervisorModalOpen] =
    useState(false);
  const [editableData, setEditableData] = useState({});

  const printRef = useRef();
  const printFunctionRef = useRef(null);
  const currentParamsOfApiCallRef = useRef(null);

  const title = DISPLAY.title();

  const currentUserData = JSON.parse(sessionStorage.getItem("user"));
  const role = get(currentUserData, "role", "");
  const isSuperAdmin = role === "Super Admin";

  const onChangeUserData = (data) => {
    setUserData(data);
    setIsLoading(false);
  };

  const callUserApi = (params = "", search = false) => {
    if (params.key) {
      params = { ...params, keyword: params.key };
      delete params.key;
    }
    currentParamsOfApiCallRef.current = params;
    const onSuccess = (response) => {
      const data = get(response, "data", "");
      const responseParams = get(response, "config.params", {});
      if (isEqual(responseParams, currentParamsOfApiCallRef.current)) {
        onChangeUserData(data);
      }
    };
    const onError = (error) => {
      console.warn(error);
    };
    const onFinally = () => {
      setIsLoading(false);
    };
    ApiKit.user
      .getUser(params)
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);
  };

  const onCloseHistory = () => {
    setIsUserModalOpen(false);
    setIsEditModalOpen(false);
    setIsAssignSupervisorModalOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const init = () => {
    setIsLoading(true);
    callUserApi();
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border-t-0" ref={printRef}>
      <div className="print:static flex flex-col md:flex-row gap-4 justify-between top-16 px-4 print:px-0 py-4 border-y print:border-t-0 border-borderColor drop-shadow-md font-bold text-2xl uppercase print:capitalize text-left bg-default text-accent print:grid print:gap-x-3 print:bg-white print:font-bold print:border-b-2 print:py-1 print:my-2 print:border-y-0 print:border-b-black print:border-t-black print:drop-shadow-none print:text-black">
        {title ? title : ""}
        <div className="flex flex-col md:flex-row gap-4">
          <Tooltip title="Add Employee">
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="print:hidden bg-blue-600 p-1 w-8 h-8 flex justify-center items-center rounded-full hover:bg-linkText text-white hover:text-amber"
            >
              <MdAdd size={20} />
            </button>
          </Tooltip>
          <Tooltip title="Print">
            <button
              onClick={handlePrint}
              className="print:hidden bg-blue-600 p-1 w-8 h-8 flex justify-center items-center rounded-full hover:bg-linkText text-white hover:text-amber"
            >
              <MdPrint size={20} />
            </button>
          </Tooltip>
        </div>
      </div>
      <List
        printFunctionRef={printFunctionRef}
        title={title}
        loading={isLoading}
        data={userData}
        renderDropdownItem={"true"}
        contextMenuData={({ row }) =>
          DISPLAY.content.contextMenu({
            row,
            isSuperAdmin,
            init,
            setEditableData,
            setIsEditModalOpen,
            setIsAssignSupervisorModalOpen,
          })
        }
        onChangeData={onChangeUserData}
        properties={DISPLAY.content.properties}
        header={DISPLAY.content.header()}
        body={({ row, column }) =>
          DISPLAY.content.body({
            row,
            column,
            isSuperAdmin,
            init,
            setEditableData,
            setIsEditModalOpen,
            setIsAssignSupervisorModalOpen,
          })
        }
        style={DISPLAY.content.style}
        customColumnClassNames={DISPLAY.content.customColumnClassNames}
        callApi={init}
      />
      <Modal
        isOpen={isUserModalOpen}
        onClose={onCloseHistory}
        title="Add Employee"
        size="sm"
      >
        <RegisterForm type="add" init={init} />
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={onCloseHistory}
        title="Edit Employee"
        size="sm"
      >
        <RegisterForm type="edit" init={init} data={editableData} />
      </Modal>
      <Modal
        isOpen={isAssignSupervisorModalOpen}
        onClose={onCloseHistory}
        title="Assign Supervisor"
        size="sm"
      >
        <AssignSupervisor
          onClose={onCloseHistory}
          init={init}
          data={editableData}
        />
      </Modal>
    </div>
  );
}
export default Employee;
