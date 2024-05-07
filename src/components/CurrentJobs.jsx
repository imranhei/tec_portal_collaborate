import { useMemo, useState } from "react";
import { Input } from "@material-tailwind/react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewIcon from "@mui/icons-material/Visibility";
import { useSelector, useDispatch } from "react-redux";
import { setJobs } from "../redux/currentJobs"; 
import { useNavigate } from "react-router-dom";
import cleaner from "../storage/cleaner";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import CreateJobModal from "./modal/CreateJobModal";

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [completedHour, setCompletedHour] = useState(null);
  const [jobId, setJobId] = useState(null);

  const handleCompletedHourChange = (e, row) => {
    setCompletedHour(e.target.value);
    setJobId(row.original.id);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableColumnFilter: false,
        enableEditing: false,
      },
      {
        accessorKey: "job_number",
        header: "Job No",
        enableEditing: true,
        size: 80,
        enableColumnFilter: true,
      },
      {
        accessorKey: "job_location",
        header: "Location",
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorFn: (originalRow) => new Date(originalRow?.start_date),
        accessorKey: "start_date",
        id: "start_date",
        header: "Start Date",
        filterVariant: "date-range",
        muiEditTextFieldProps: {
          type: "date", // Or "datetime" for date and time
          required: true,
        },
        Cell: ({ cell, renderedCellValue, row }) => row.original.start_date,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow?.completion_date),
        id: "completion_date",
        header: "Completion Date",
        filterVariant: "date-range",
        muiEditTextFieldProps: {
          type: "date",
        },
        Cell: ({ cell, row }) => row.original.completion_date,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow?.assign_date),
        accessorKey: "assign_date",
        id: "assign_date",
        header: "Assign Date",
        filterVariant: "date-range",
        muiEditTextFieldProps: {
          type: "date", // Or "datetime" for date and time
          required: true,
        },
        Cell: ({ cell, renderedCellValue, row }) => row.original.assign_date,
      },
      {
        accessorKey: "assign_hours",
        header: "Assign Hours",
        enableEditing: true,
        muiEditTextFieldProps: {
          type: "number",
          required: true,
        },
      },
      {
        accessorKey: "completed_hours",
        header: "Working Hours",
        enableEditing: true,
        muiEditTextFieldProps: {
          type: "number",
          required: true,
        },
      },
      {
        accessorKey: "attachment",
        header: "Attachment",
        muiEditTextFieldProps: {
          type: "file",
          required: true,
        },
      },
    ],
    [validationErrors]
  );

  const {
    data: fetchedJobs = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser(jobId);

  //UPDATE action
  const handleSaveUser = async ({ values, table, row }) => {
    // const newValidationErrors = validateUser(row);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    setValidationErrors({});
    if(completedHour !== null) await updateUser(completedHour);
    table.setEditingRow(null); //exit editing mode
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedJobs, //data,
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },

    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,

    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
      return (
        <>
          <DialogTitle variant="h4">Update Hours</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div className="pt-4">
            {/* <Input
                label="Job Location"
                variant="standard"
                type="text"
                defaultValue={tempRow?.job_location}
                onChange={(e) =>
                  handleInputChange("job_location", e.target.value)
                }
              /> */}
              <Input
                label="Working Hours"
                variant="standard"
                type="number"
                defaultValue={completedHour || row.original.completed_hours}
                onChange={(e) =>
                  handleCompletedHourChange(e, row)
                }
                // error={validationErrors.completed_hours}
                // helperText={validationErrors.completed_hours}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </DialogActions>
        </>
      );
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isUpdatingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
      columnVisibility: {
        id: false,
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

function useGetUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/user/jobs",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          cleaner();
          navigate("/login");
        }
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const modifiedData = data.map(({ job, job_assigns }) => ({
        ...job,
        ...job_assigns,
      }));
      dispatch(setJobs(modifiedData));

      return modifiedData;
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUser(jobId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      // Create form data object
      const user_id = JSON.parse(sessionStorage.getItem("user"));
      // Send POST request to update user
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/jobs/${jobId}/users/${user_id?.id}/assign-hours`,
        {
          method: "PUT",
          headers: {
            // Don't set Content-Type here, fetch will do it automatically for FormData
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: JSON.stringify({
            assign_hours: user,
          }), // Pass FormData directly as body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Assuming the response is JSON
      const data = await response.json();

      // Return data if needed
      return data;
    },
    // client side optimistic update
    // onMutate: (newUserInfo) => {
    //   queryClient.setQueryData(["users"], (prevUsers) =>
    //     prevUsers?.map((prevUser) =>
    //       prevUser.job_number === newUserInfo.job_number
    //         ? newUserInfo
    //         : prevUser
    //     )
    //   );
    // },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const CurrentJobs = () => (
  //Put this with your other react-query providers near root of your app
  <div className="w-full">
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <Example />
      </QueryClientProvider>
    </LocalizationProvider>
  </div>
);

export default CurrentJobs;

const validateRequired = (value) => !!value.length;

function validateUser(user) {
  return {
    job_number: !validateRequired(user.job_number)
      ? "Job Number is Required"
      : "",
    job_location: !validateRequired(user.job_location)
      ? "Job Location is Required"
      : "",
    total_hours: isNaN(user.total_hours) ? "Total Hours is Required" : "",
    // start_date: !validateDate(user.start_date) ? "Start Date is Required" : "",
  };
}
