import { useMemo, useState, useEffect } from "react";
import { Input, Select, Option } from "@material-tailwind/react";
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

const Example = ({ id }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [tempRow, setTempRow] = useState({ id: "mrt-row-create" });
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    fetch("https://backend.tec.ampectech.com/api/electricians", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const electricians = data.electricians.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        setEmployeeList(electricians);
      });
  }, []);

  const handleInputChange = (field, value) => {
    setTempRow((prevTempRow) => ({
      ...prevTempRow,
      [field]: value,
    }));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "user_id",
        header: "ID",
        size: 30,
        enableEditing: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableEditing: false,
        size: 80,
        // enableColumnFilter: false,
        // Cell: ({ renderedCellValue }) => (
        //   <span>{renderedCellValue}</span>
        // ),
      },
      {
        // accessorFn: (originalRow) => new Date(originalRow?.assign_date),
        accessorKey: "assign_date",
        header: "Assign Date",
        enableEditing: false,
        muiEditTextFieldProps: {
          type: "date",
          required: true,
        },
        // Cell: ({ row }) => row.original.assign_date,
        // muiEditTextFieldProps: {
        //   required: true,
        //   error: !!validationErrors?.firstName,
        //   helperText: validationErrors?.firstName,
        //   //remove any previous validation errors when user focuses on the input
        //   onFocus: () =>
        //     setValidationErrors({
        //       ...validationErrors,
        //       firstName: undefined,
        //     }),
        //   //optionally add validation checking for onBlur or onChange
        // },
      },
      {
        accessorFn: (originalRow) => Number(originalRow?.assign_hours || 0),
        accessorKey: "assign_hours",
        header: "Assigned Hours",
        filterVariant: "range",
        filterFn: "between",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
        },
      },
      {
        accessorKey: "completed_hours",
        // enableEditing: false,
        header: "Completed Hours",
        filterVariant: "range",
        filterFn: "between",
        enableEditing: false,
        muiEditTextFieldProps: {
          type: "number",
          required: true,
        },
      },
    ]
    // [validationErrors]
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser(id);
  //call READ hook
  const {
    data: employeeDetails = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers(id);
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser(id);
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser(id);

  //CREATE action
  const handleCreateUser = async ({ values, table, row }) => {
    // const newValidationErrors = validateUser(values);

    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    setValidationErrors({});
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const employee = employeeList.find((item) => item.id == tempRow.user_id);
    const name = employee ? employee.name : "Unknown";
    const modifiedJson = {
      ...tempRow,
      name: name,
      assign_date: formattedDate,
      completed_hours: 0,
    };
    await createUser(modifiedJson);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser = async ({ values, table }) => {
    // const newValidationErrors = validateUser(values);
    // // console.log(values)
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(row.original.user_id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: employeeDetails,
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
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
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      const handleChange = (field, value) => {
        handleInputChange(field, value);
      };
      return (
        <>
          <DialogTitle variant="h4">Assign Employee</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* {internalEditComponents} */}
            <div className="flex flex-col py-5 gap-6">
              {/* <Input
                label="Name"
                variant="standard"
                type="text"
                defaultValue={tempRow?.name}
                onChange={(e) => handleChange("name", e.target.value)}
              /> */}
              <Select
                variant="standard"
                label="Select Name"
                onChange={(e) => handleChange("user_id", e)}
              >
                {employeeList?.map((item) => (
                  <Option key={item?.id} value={String(item?.id)}>
                    {item?.name}
                  </Option>
                ))}
              </Select>
              {/* <Input
                label="Assign Date"
                variant="standard"
                type="date"
                defaultValue={tempRow?.assign_date}
                onChange={(e) => handleChange("assign_date", e.target.value)}
              /> */}
              <Input
                label="Assigned Hours"
                variant="standard"
                type="number"
                defaultValue={tempRow?.assign_hours}
                onChange={(e) => handleChange("assign_hours", e.target.value)}
              />
              {/* <Input
                label="Completed Hours"
                variant="standard"
                type="number"
                defaultValue={tempRow?.completed_hours}
                onChange={(e) =>
                  handleChange("completed_hours", e.target.value)
                }
              /> */}
            </div>
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons variant="text" table={table} row={tempRow} />
          </DialogActions>
        </>
      );
    },
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Edit Details</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0rem" }}>
        {/* <Tooltip title="View">
          <IconButton onClick={() => handleView(row.original)}>
            <ViewIcon />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table, row }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Assign Employee
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
      // columnVisibility: {
      //   user_id: false,
      // },
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser(id) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      // console.log(user);
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/jobs/${id}/assign-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: JSON.stringify({
            user_ids: [user.user_id],
            assign_hours: [user.assign_hours],
          }),
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
      console.log(data);
      return;
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      const prevUsers = queryClient.getQueryData(["users"]); // Get prevUsers from cache
      if (!Array.isArray(prevUsers)) {
        return queryClient.setQueryData(["users"], []);
      }
      queryClient.setQueryData(["users"], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetUsers(id) {
  const navigate = useNavigate();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      //send api request here
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/jobs/${id}`,
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
      return data.job_assigns;
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUser(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      // Send PUT request to update user
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/jobs/${id}/users/${user.user_id}/assign-hours`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
          body: JSON.stringify({ assign_hours: user.assign_hours }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Assuming the response is JSON
      const data = await response.json();
      console.log(data);

      // Return data if needed
      return data;
    },

    //client side optimistic update
    onMutate: (newUserInfo) => {
      const prevUsers = queryClient.getQueryData(["users"]); // Get prevUsers from cache
      if (!Array.isArray(prevUsers)) {
        return queryClient.setQueryData(["users"], []);
      }
      queryClient.setQueryData(["users"], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.user_id === newUserInfo.user_id ? newUserInfo : prevUser
        )
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteUser(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      //send api update request here
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/jobs/${id}/users/${userId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      // Assuming the response is JSON
      const data = await response.json();
      console.log(data)

      // Return data if needed
      return data;
    },
    //client side optimistic update
    onMutate: (userId) => {
      queryClient.setQueryData(["users"], (prevUsers) =>
        prevUsers?.filter((user) => user.user_id !== userId)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const EmpDetails = ({ id }) => {
  //Put this with your other react-query providers near root of your app
  return (
    <div className="w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <Example id={id} />
        </QueryClientProvider>
      </LocalizationProvider>
    </div>
  );
};

export default EmpDetails;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

function validateUser(user) {
  console.log(user);
  return {
    em_name: !validateRequired(user.em_name) ? "Job Id is Required" : "",
    // lastName: !validateRequired(user.lastName) ? "Last Name is Required" : "",
    // email: !validateEmail(user.email) ? "Incorrect Email Format" : "",
  };
}
