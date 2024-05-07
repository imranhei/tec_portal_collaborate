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
import { useNavigate } from "react-router-dom";
import cleaner from "../storage/cleaner";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import CreateJobModal from "./modal/CreateJobModal";

const Example = () => {
  //   const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  //   const [tempRow, setTempRow] = useState(null);

  const handleView = (row) => {
    navigate("/jobsheet", { state: { row, view:true } });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "job_no",
        header: "Job No",
        enableEditing: true,
        size: 80,
        enableColumnFilter: true,
      },
      {
        accessorKey: "store",
        header: "Store",
        size: 80,
        enableColumnFilter: true,
        enableEditing: false,
      },
      {
        accessorKey: "location",
        header: "Location",
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          //   error: !!validationErrors?.firstName,
          //   helperText: validationErrors?.firstName,
          //   //remove any previous validation errors when user focuses on the input
          //   onFocus: () =>
          //     setValidationErrors({
          //       ...validationErrors,
          //       firstName: undefined,
          //     }),
          //   //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorFn: (originalRow) => new Date(originalRow?.created_at),
        accessorKey: "created_at",
        id: "created_at",
        header: "Submission Date",
        filterVariant: "date-range",
        muiEditTextFieldProps: {
          type: "date", // Or "datetime" for date and time
          required: true,
        },
        Cell: ({ cell, renderedCellValue, row }) => {
          const timestamp = row.original.created_at; // Example timestamp

          // Parse the timestamp string into a Date object
          const dateObj = new Date(timestamp);

          // Get the date, month, and year components
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index (0 for January)
          const date = dateObj.getDate();

          // Format the components as needed (e.g., to display leading zeros for single-digit month/date)
          const formattedDate = `${year}-${month
            .toString()
            .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
        return formattedDate
        },
      },
    ]
    // [validationErrors]
  );

  //call CREATE hook
  //   const { mutateAsync: createUser, isPending: isCreatingUser } =
  //     useCreateUser();
  //call READ hook
  const {
    data: fetchedJobs = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  //   const { mutateAsync: updateUser, isPending: isUpdatingUser } =
  //     useUpdateUser();
  //call DELETE hook
  //   const { mutateAsync: deleteUser, isPending: isDeletingUser } =
  //     useDeleteUser();

  //CREATE action
  //   const handleCreateUser = async ({ values, table, row }) => {
  //     const newValidationErrors = validateUser(values);

  //     if (Object.values(newValidationErrors).some((error) => error)) {
  //       setValidationErrors(newValidationErrors);
  //       return;
  //     }
  //     setValidationErrors({});
  //     await createUser(values);
  //     table.setCreatingRow(null); //exit creating mode
  //   };

  //UPDATE action
  //   const handleSaveUser = async ({ values, table, row }) => {
  //     const newValidationErrors = validateUser(row);
  //     if (Object.values(newValidationErrors).some((error) => error)) {
  //       setValidationErrors(newValidationErrors);
  //       return;
  //     }
  //     setValidationErrors({});
  //     await updateUser(row);
  //     table.setEditingRow(null); //exit editing mode
  //   };

  //DELETE action
  //   const openDeleteConfirmModal = (row) => {
  //     if (window.confirm("Are you sure you want to delete this user?")) {
  //       deleteUser(row.original.id);
  //     }
  //   };

  const table = useMaterialReactTable({
    columns,
    data: fetchedJobs, //data,
    // createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    // editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
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
    // onCreatingRowCancel: () => setValidationErrors({}),
    // onCreatingRowSave: handleCreateUser,
    // onEditingRowCancel: () => setValidationErrors({}),
    // onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    // renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
    // const [tempCreateRow, setTempCreateRow] = useState(row.original);

    // const handleInputChange = (field, value) => {
    //   setTempCreateRow((prevTempRow) => ({
    //     ...prevTempRow,
    //     [field]: value,
    //   }));
    // }
    //   return (
    //     <>
    //       <DialogTitle variant="h4">Create New Job</DialogTitle>
    //       <DialogContent
    //         sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    //       >
    //         {internalEditComponents}
    // {/* <div className="flex flex-col py-5 gap-6">
    //   <Input
    //     label="Job Number"
    //     variant="static"
    //     type="text"
    //     defaultValue={tempCreateRow?.job_number}
    //     onChange={(e) =>
    //       handleInputChange("job_number", e.target.value)
    //     }
    //     className="h-4"
    //   />
    //   <Input
    //     label="Job Location"
    //     variant="static"
    //     type="text"
    //     defaultValue={tempCreateRow?.job_location}
    //     onChange={(e) =>
    //       handleInputChange("job_location", e.target.value)
    //     }
    //   />
    //   <Input
    //     label="Total Hours"
    //     variant="static"
    //     type="number"
    //     defaultValue={tempCreateRow?.total_hours}
    //     onChange={(e) =>
    //       handleInputChange("total_hours", e.target.value)
    //     }
    //   />
    //   <Input
    //     label="Start Date"
    //     variant="static"
    //     type="date"
    //     defaultValue={tempCreateRow?.start_date}
    //     onChange={(e) =>
    //       handleInputChange("start_date", e.target.value)
    //     }
    //   />
    //   <Input
    //     label="Completion Date"
    //     variant="static"
    //     type="date"
    //     defaultValue={tempCreateRow?.completion_date}
    //     onChange={(e) =>
    //       handleInputChange("completion_date", e.target.value)
    //     }
    //   />
    // </div> */}
    //       </DialogContent>
    //       <DialogActions>
    //         <MRT_EditActionButtons variant="text" table={table} row={row} />
    //       </DialogActions>
    //     </>
    //   );
    // },
    //optionally customize modal content
    // renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
    //   if (tempRow === null) {
    //     setTempRow(row.original);
    //   }
    //   const handleInputChange = (field, value) => {
    //     setTempRow((prevTempRow) => ({
    //       ...prevTempRow,
    //       [field]: value,
    //     }));
    //   };
    //   return (
    //     <>
    //       <DialogTitle variant="h4">Edit Project</DialogTitle>
    //       <DialogContent
    //         sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    //       >
    //         <div className="flex flex-col py-5 gap-6">
    //           <Input
    //             label="Job Number"
    //             variant="standard"
    //             type="text"
    //             defaultValue={tempRow?.job_number}
    //             onChange={(e) =>
    //               handleInputChange("job_number", e.target.value)
    //             }
    //           />
    //           <Input
    //             label="Job Location"
    //             variant="standard"
    //             type="text"
    //             defaultValue={tempRow?.job_location}
    //             onChange={(e) =>
    //               handleInputChange("job_location", e.target.value)
    //             }
    //           />
    //           <Input
    //             label="Total Hours"
    //             variant="standard"
    //             type="number"
    //             defaultValue={tempRow?.total_hours}
    //             onChange={(e) =>
    //               handleInputChange("total_hours", e.target.value)
    //             }
    //           />
    //           <Input
    //             label="Start Date"
    //             variant="standard"
    //             type="date"
    //             defaultValue={tempRow?.start_date}
    //             onChange={(e) =>
    //               handleInputChange("start_date", e.target.value)
    //             }
    //           />
    //           <Input
    //             label="Completion Date"
    //             variant="standard"
    //             type="date"
    //             defaultValue={tempRow?.completion_date}
    //             onChange={(e) =>
    //               handleInputChange("completion_date", e.target.value)
    //             }
    //           />
    //         </div>
    //       </DialogContent>
    //       <DialogActions>
    //         <MRT_EditActionButtons variant="text" table={table} row={tempRow} />
    //       </DialogActions>
    //     </>
    //   );
    // },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0rem" }}>
        <Tooltip title="View">
          <IconButton onClick={() => handleView(row?.original)}>
            <ViewIcon />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
         <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip> */}
      </Box>
    ),
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Button
    //     variant="contained"
    //     onClick={() => {
    //       table.setCreatingRow(true); //simplest way to open the create row modal with no default values
    //     }}
    //   >
    //     Create New Job
    //   </Button>
    // ),
    state: {
      isLoading: isLoadingUsers,
      //   isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      //   showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
      //   columnVisibility: {
      //     id: false,
      //   },
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
// function useCreateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       const formData = new FormData();
//       formData.append("job_number", user.job_number);
//       formData.append("job_location", user.job_location);
//       formData.append("total_hours", user.total_hours);
//       formData.append("start_date", user.start_date);
//       formData.append("completion_date", user.completion_date);
//       formData.append("attachment", user.attachment);

//       const response = await fetch(
//         "https://backend.tec.ampectech.com/api/jobs",
//         {
//           method: "POST",
//           headers: {
//             // "Content-Type": "multipart/form-data",
//             // "Accept": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           console.log("Unauthorized");
//         }
//         throw new Error("Failed to create user");
//       }

//       // Assuming the response is JSON
//       const data = await response.json();

//       // Return data if needed
//       return data;
//     },
//     // client side optimistic update
//     onMutate: (newUserInfo) => {
//       const prevUsers = queryClient.getQueryData(["users"]); // Get prevUsers from cache
//       if (!Array.isArray(prevUsers)) {
//         return queryClient.setQueryData(["users"], []);
//       }
//       queryClient.setQueryData(["users"], (prevUsers) => [
//         ...prevUsers,
//         {
//           ...newUserInfo,
//           id: (Math.random() + 1).toString(36).substring(7),
//         },
//       ]);
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
//   });
// }

function useGetUsers() {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/user/job-sheets",
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
      return data.data;
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
// function useUpdateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       // Create form data object
//       const formData = new FormData();
//       // Append user data to the form data object
//       Object.entries(user).forEach(([key, value]) => {
//         formData.append(key, value);
//       });
// console.log(user)
// const formData = new FormData();
// formData.append("job_number", user.job_number);
// formData.append("job_location", user.job_location);
// formData.append("total_hours", user.total_hours);
// if (typeof user.start_date === "string") {
//   formData.append("start_date", user.start_date);
// } else {
//   const date = user.start_date; // Current date
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month starts from 0, so add 1
//   const day = date.getDate().toString().padStart(2, "0");
//   formData.append("start_date", `${year}-${month}-${day}`);
// }
// if (typeof user.completion_date === "string") {
//   formData.append("completion_date", user.completion_date);
// } else {
//   const date = user.completion_date; // Current date
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month starts from 0, so add 1
//   const day = date.getDate().toString().padStart(2, "0");
//   formData.append("completion_date", `${year}-${month}-${day}`);
// }
// formData.append('attachment', user.attachment);

// Send POST request to update user
//   const response = await fetch(
//     `https://backend.tec.ampectech.com/api/jobs/${user.id}`,
//     {
//       method: "POST",
//       headers: {
//         // Don't set Content-Type here, fetch will do it automatically for FormData
//         Accept: "application/json",
//         Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
//       },
//       body: formData, // Pass FormData directly as body
//     }
//   );

// if (!response.ok) {
//   throw new Error("Failed to update user");
// }

// Assuming the response is JSON
//       const data = await response.json();

//       // Return data if needed
//       return data;
//     },
//     // client side optimistic update
//     onMutate: (newUserInfo) => {
//       queryClient.setQueryData(["users"], (prevUsers) =>
//         prevUsers?.map((prevUser) =>
//           prevUser.job_number === newUserInfo.job_number
//             ? newUserInfo
//             : prevUser
//         )
//       );
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
//   });
// }

//DELETE hook (delete user in api)
// function useDeleteUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (userId) => {
//       // Send DELETE request to API endpoint
//       const response = await fetch(
//         `https://backend.tec.ampectech.com/api/jobs/${userId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete user");
//       }

//       // Assuming the response is JSON
//       const data = await response.json();

//       // Return data if needed
//       return data;
//     },
//     //client side optimistic update
//     onMutate: (userId) => {
//       queryClient.setQueryData(["users"], (prevUsers) =>
//         prevUsers?.filter((user) => user.id !== userId)
//       );
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
//   });
// }

const queryClient = new QueryClient();

const JobSheets = () => (
  //Put this with your other react-query providers near root of your app
  <div className="w-full">
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <Example />
      </QueryClientProvider>
    </LocalizationProvider>
  </div>
);

export default JobSheets;

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// const validateDate = (date) => !!date.toISOString().length;

// function validateUser(user) {
//   return {
//     job_number: !validateRequired(user.job_number)
//       ? "Job Number is Required"
//       : "",
//     job_location: !validateRequired(user.job_location)
//       ? "Job Location is Required"
//       : "",
//     total_hours: isNaN(user.total_hours) ? "Total Hours is Required" : "",
//     // start_date: !validateDate(user.start_date) ? "Start Date is Required" : "",
//   };
// }
