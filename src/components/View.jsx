import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EmpDetails from "./EmpDetails";

export default function View() {
  const location = useLocation();
  const [row, setRow] = useState(null);

  useEffect(() => {
    setRow(location.state?.row);
  }, [location]);

  if (!row) {
    return <div>No data available.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-6 bg-white border rounded shadow font-semibold">
        <h2 className="text-2xl font-bold pb-4">Job Number: {row?.job_number}</h2>
        <p>Location: {row?.job_location}</p>
        <p>Total Hours: {row?.total_hours}</p>
        <p>Start Date: {row?.start_date}</p>
        <p>Completion Date: {row?.completion_date}</p>
      </div>
      <div className="p-6 bg-white border rounded shadow">
        <h2 className="font-bold text-xl pb-4">Assigned Employees</h2>
        <EmpDetails id={row?.id}/>
      </div>
    </div>
  );
}
