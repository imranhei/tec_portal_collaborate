import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../shared/toastHelper";

export default function JobSheet() {
  const navigate = useNavigate();
  // const [editable, setEditable] = useState(useSelector((state) => state.userNotification.editable));
  const { jobs } = useSelector((state) => state.currentJobs);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [field, setField] = useState(null);
  const [view, setView] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState("50px");
  const [textareaHeight2, setTextareaHeight2] = useState("50px");
  const [approved, setApproved] = useState(true);
  const [updateActivate, setUpdateActivate] = useState(false);
  const [dropDown, setDropDown] = useState({
    store: [],
    floor: [],
    location: [],
    work_authorised_by: [],
  });
  const handleOpen = (type) => {
    if (data[type]) {
      setOpen(!open);
      setField(type);
    }
    return;
  };

  const [data, setData] = useState({
    store: "",
    floor: "",
    location: "",
    job_no: "",
    work_authorised_by: "",
    date: "",
    reason: "",
    performed: "",
    materials: [{ quantity: "", description: "" }],
    labor: [
      {
        leading: {
          Nt: "",
          shift: "",
          ot: "",
        },
        tradesman: {
          Nt: "",
          shift: "",
          ot: "",
        },
        apprentice: {
          Nt: "",
          shift: "",
          ot: "",
        },
      },
    ],
  });

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...data.materials];
    list[index][name] = value;
    setData({ ...data, materials: list });
  };

  useEffect(() => {
    fetchDropDown();
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.row) {
      setView(location.state?.view);
      setData(location.state?.row);
      // setEditable(location.state?.row);
      setApproved(location.state?.approved);
      setUpdateActivate(location.state?.updateActivate);
    }
  }, [location]);

  const addRow = () => {
    setData({
      ...data,
      materials: [...data.materials, { quantity: "", description: "" }],
    });
  };

  const handleDeleteRow = (index) => {
    const list = [...data.materials];
    list.splice(index, 1);
    setData({ ...data, materials: list });
  };

  const handleInputChange2 = (labourIndex, type, time, value) => {
    const updatedLabour = [...data.labor]; // Create a copy of the labour array
    const updatedLabourItem = { ...updatedLabour[labourIndex] }; // Create a copy of the specific labour item
    updatedLabourItem[type][time] = value; // Update the value
    updatedLabour[labourIndex] = updatedLabourItem; // Update the specific labour item in the array
    setData({ ...data, labor: updatedLabour }); // Update the state with the new labour array
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleHeight = (e) => {
    // setText(e.target.value);
    const newHeight = e.target.scrollHeight + 1 + "px";
    setTextareaHeight(newHeight);
  };

  const handleHeight2 = (e) => {
    // setText(e.target.value);
    const newHeight = e.target.scrollHeight + 1 + "px";
    setTextareaHeight2(newHeight);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/jobsheets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save job sheet");
      }

      clearForm();
      toastSuccess({ message: "Job sheet saved successfully" });
    } catch (error) {
      console.error("Error saving job sheet:", error);
      toastError({ message: "Failed to save job sheet" });
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/jobsheets/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update job sheet");
      }
      clearForm();
      toastSuccess({ message: "Job sheet updated successfully" });
    } catch (error) {
      console.error("Error updating job sheet:", error);
      toastError({ message: "Failed to update job sheet" });
    }
  };

  const fetchDropDown = async () => {
    try {
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/drop_downs",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dropdowns");
      }

      const data = await response.json();
      setDropDown(data);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };

  const handleDropDownUpdate = async () => {
    const formData = new FormData();
    formData.append(field, data[field]);

    try {
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/drop_downs/add`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to add ${field}`);
      }

      const data = await response.json();
      fetchDropDown();
    } catch (error) {
      toastError({ message: `Failed to add ${field}` });
    }
    setOpen(!open);
  };

  const clearForm = () => {
    setUpdateActivate(false);
    setView(false);
    setData({
      store: "",
      floor: "",
      location: "",
      job_no: "",
      work_authorised_by: "",
      date: "",
      reason: "",
      performed: "",
      materials: [{ quantity: "", description: "" }],
      labor: [
        {
          leading: {
            Nt: "",
            shift: "",
            ot: "",
          },
          tradesman: {
            Nt: "",
            shift: "",
            ot: "",
          },
          apprentice: {
            Nt: "",
            shift: "",
            ot: "",
          },
        },
      ],
    });
  };

  const handleRequest = async () => {
    try {
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/notifications/${data.id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to request edit");
      }
      toastSuccess({ message: "Request sent successfully" });
    } catch (error) {
      console.error("Error requesting edit:", error);
      toastError({ message: "Failed to request edit" });
    }
  };

  return (
    <div className="space-y-6">
      {user?.role === "Electrician" && (
        <div className="w-full flex justify-center px-4 gap-4">
          <Button
            variant="outlined"
            className="hover:bg-black hover:text-white"
            size="sm"
            onClick={() => {
              navigate("/jobsheet");
              clearForm();
            }}
          >
            New Job Sheet
          </Button>
          <Button
            variant="outlined"
            className="hover:bg-black hover:text-white"
            size="sm"
            onClick={() => navigate("/jobsheets")}
          >
            Previous Job Sheet
          </Button>
        </div>
      )}
      <div
        className="px-6 py-10 w-[700px] border print:border-none bg-white shadow print:shadow-none mx-auto text-sm"
        ref={componentRef}
      >
        <h1 className="text-center text-2xl font-bold pb-2">
          TOTAL ELECTRICAL CONNECTION PTY LTD
        </h1>
        <hr className="border-black my-px" />
        <hr className="border-black" />
        <h1 className="text-center my-4 font-semibold text-lg">JOB SHEET</h1>
        <Dialog open={open} handler={handleOpen}>
          <DialogBody>
            Are you sure you want to add this{" "}
            <span className="font-bold">{field}</span> name to the suggestion
            list?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setOpen(!open)}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={handleDropDownUpdate}
            >
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
        <div className="space-y-2">
          <div className="flex gap-2 justify-between">
            <div className="flex w-80 items-center">
              <p>Store :</p>
              <input
                type="text"
                value={data?.store || ""}
                list="store"
                className="border-b outline-none focus:border-b-black pl-2 flex-1 bg-white"
                onChange={(e) => setData({ ...data, store: e.target.value })}
                disabled={!approved}
              />
              <datalist id="store">
                <option
                  value=""
                  style={{ opacity: 0.25 }}
                  className=""
                ></option>
                {dropDown?.store?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </datalist>
              {!view && (
                <Tooltip content="Add in the suggestion list">
                  <Button
                    disabled={false}
                    variant="outlined"
                    className="px-2 py-1 print:hidden"
                    onClick={() => {
                      handleOpen("store");
                    }}
                  >
                    +
                  </Button>
                </Tooltip>
              )}
            </div>
            <div className="flex w-80 items-center">
              <p>Floor/Level :</p>
              <input
                type="text"
                value={data?.floor || ""}
                list="floor"
                className="border-b outline-none focus:border-b-black pl-2 bg-white flex-1"
                onChange={(e) => setData({ ...data, floor: e.target.value })}
                disabled={!approved}
              />
              <datalist id="floor">
                <option
                  value=""
                  style={{ opacity: 0.25 }}
                  className=""
                ></option>
                {dropDown?.floor?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </datalist>
              {!view && (
                <Tooltip content="Add in the suggestion list">
                  <Button
                    disabled={false}
                    variant="outlined"
                    className="px-2 py-1 print:hidden"
                    onClick={() => {
                      handleOpen("floor");
                    }}
                  >
                    +
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex w-full items-center">
            <p>Department/Location :</p>
            <input
              type="text"
              value={data?.location || ""}
              list="location"
              className="border-b outline-none focus:border-b-black bg-white pl-2 flex-1"
              onChange={(e) => setData({ ...data, location: e.target.value })}
              disabled={!approved}
            />
            <datalist id="location">
              <option value="" style={{ opacity: 0.25 }} className=""></option>
              {dropDown?.location?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </datalist>
            {!view && (
              <Tooltip content="Add in the suggestion list">
                <Button
                  disabled={false}
                  variant="outlined"
                  className="px-2 py-1 print:hidden"
                  onClick={() => {
                    handleOpen("location");
                  }}
                >
                  +
                </Button>
              </Tooltip>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex w-80 items-center">
              <p>Job No :</p>
              <input
                type="text"
                value={data?.job_no || ""}
                list="jobNumbers"
                className="border-b outline-none focus:border-b-black bg-white pl-2 flex-1"
                onChange={(e) => setData({ ...data, job_no: e.target.value })}
                disabled={!approved}
              />
              <datalist id="jobNumbers">
                <option
                  value=""
                  style={{ opacity: 0.25 }}
                  className=""
                ></option>
                {jobs?.map((item) => (
                  <option key={item?.job_number} value={item?.job_number}>
                    {item?.job_number}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="flex w-80 items-center  justify-between">
              <p>Work Authorised By :</p>
              <input
                type="text"
                value={data?.work_authorised_by || ""}
                list="work_authorised_by"
                className="border-b outline-none focus:border-b-black bg-white pl-2 w-40"
                onChange={(e) =>
                  setData({ ...data, work_authorised_by: e.target.value })
                }
                disabled={!approved}
              />
              <datalist id="work_authorised_by">
                <option
                  value=""
                  style={{ opacity: 0.25 }}
                  className=""
                ></option>
                {dropDown?.work_authorised_by?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </datalist>
              {!view && (
                <Tooltip content="Add in the suggestion list">
                  <Button
                    disabled={false}
                    variant="outlined"
                    className="px-2 py-1 print:hidden"
                    onClick={() => {
                      handleOpen("work_authorised_by");
                    }}
                  >
                    +
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex w-full">
            <p>Date Work Performed :</p>
            <input
              value={data?.date || ""}
              type="date"
              className={`border-b outline-none focus:border-b-black bg-white pl-2 flex-1 ${
                data?.date ? "" : "opacity-50"
              }`}
              onChange={(e) => setData({ ...data, date: e.target.value })}
              disabled={!approved}
            />
          </div>
          <div className="w-full">
            <p>Reason Work was Carried Out :</p>
            <textarea
              value={data?.reason || ""}
              style={{ height: textareaHeight }}
              type="text"
              className="border-b outline-none focus:border-b-black bg-white w-full"
              onChange={(e) => {
                handleHeight(e);
                setData({ ...data, reason: e.target.value });
              }}
              disabled={!approved}
            />
          </div>
          <h1 className="underline">Description of Work</h1>
          <div className="w-full">
            <p>Performed :</p>
            <textarea
              value={data?.performed || ""}
              style={{ height: textareaHeight2 }}
              type="text"
              className="border-b outline-none focus:border-b-black bg-white w-full"
              onChange={(e) => {
                handleHeight2(e);
                setData({ ...data, performed: e.target.value });
              }}
              disabled={!approved}
            />
          </div>
          <div className="h-4"></div>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-1" colSpan="3">
                  Materials/Equipment
                </th>
              </tr>
              <tr>
                <th className="border border-gray-400 py-1">Quantity</th>
                <th className="border border-gray-400 py-1" colSpan="2">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.materials?.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 w-24">
                    <input
                      type="number"
                      name="quantity"
                      value={row.quantity || ""}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full outline-none focus:bg-gray-200 bg-white px-2 py-1 text-center"
                      disabled={!approved}
                    />
                  </td>
                  <td className="border border-gray-400">
                    <input
                      type="text"
                      name="description"
                      value={row.description || ""}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full outline-none focus:bg-gray-200 bg-white py-1 px-1"
                      disabled={!approved}
                    />
                  </td>
                  {!view && (
                    <td className="border border-gray-400 w-8 print:hidden">
                      <button
                        className="text-red-400 hover:text-red-500"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7Zm2-4h2V8H9v9Zm4 0h2V8h-2v9Z"
                          />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!view && (
            <Button
              size="sm"
              onClick={addRow}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded print:hidden"
            >
              Add Row
            </Button>
          )}
          <div className="h-4"></div>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-1" colSpan="6">
                  Labour
                </th>
              </tr>
              <tr>
                {["Leading Hand", "Tradesman", "Apprentice"].map(
                  (role, index) => (
                    <th
                      key={role}
                      className="border border-gray-400 py-1"
                      colSpan="2"
                    >
                      {role} (Hours)
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data?.labor?.map((labourItem, labourIndex) => (
                <React.Fragment key={labourIndex}>
                  {["Nt", "shift", "ot"].map((time) => (
                    <tr key={`${labourIndex}-${time}`}>
                      {Object.keys(labourItem).map((type) => (
                        <React.Fragment key={`${type}-${time}`}>
                          <td className="border border-gray-400 px-1">
                            {time.toUpperCase()}
                          </td>
                          <td className="border border-gray-400">
                            <input
                              type="number"
                              name={time}
                              value={labourItem[type][time] || ""}
                              onChange={(e) =>
                                handleInputChange2(
                                  labourIndex,
                                  type,
                                  time,
                                  e.target.value
                                )
                              }
                              disabled={!approved}
                              className="w-full outline-none focus:bg-gray-200 bg-white py-1 px-1"
                            />
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center items-center gap-4 mt-4">
          <IconButton
            size="sm"
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded print:hidden"
          >
            Print
          </IconButton>
          {view && user?.role === "Electrician" && (
            <Button
              size="sm"
              onClick={handleRequest}
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 w-36 px-4 rounded print:hidden"
            >
              Request to edit
            </Button>
          )}
          {!view && (
            <IconButton
              size="sm"
              onClick={
                updateActivate ? () => handleUpdate(data.id) : handleSave
              }
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-10 rounded print:hidden"
            >
              {updateActivate ? "Update" : "Save"}
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}
