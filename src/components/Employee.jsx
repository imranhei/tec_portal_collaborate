import { useMemo, useState } from "react";
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
// import { useDispatch, useSelector } from "react-redux";
// import { setLoggedIn } from "../redux/auth";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const Example = () => {
  const [validationErrors, setValidationErrors] = useState({});
  //   const handleView = (row) => {
  //     navigate("/projects/view", { state: { row } });
  //   };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        // size: "small",
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        enableEditing: false,
      },
      {
        accessorKey: "name",
        header: "Employee Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "roles",
        header: "Role",
        editVariant: "select",
        editSelectOptions: ["Super Admin", "Admin", "Electrician"],
        muiEditTextFieldProps: {
          select: true,
        },
      },
    ]
    // [validationErrors]
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: employeers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values);

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    // console.log(values);
    await createUser(values);
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
    console.log(values);
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: employeers,
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
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Register New Employee</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Edit Employee</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}{" "}
          {
            console.log(
              row.original
            ) /* or render custom edit components here */
          }
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
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Button
    //     variant="contained"
    //     onClick={() => {
    //       table.setCreatingRow(true); //simplest way to open the create row modal with no default values
    //       //or you can pass in a row object to set default values with the `createRow` helper function
    //       // table.setCreatingRow(
    //       //   createRow(table, {
    //       //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
    //       //   }),
    //       // );
    //     }}
    //   >
    //     Register New Employee
    //   </Button>
    // ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(["users"], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetUsers() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(
        "https://backend.tec.ampectech.com/api/users",
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
          // Redirect to the login page
          // dispatch(setLoggedIn(false));
          cleaner();
          navigate("/login");
        }
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const userRoles = JSON.parse(sessionStorage.getItem("user")).role;
  
      // Filter out the "Super Admin" role
      const filteredUserData = data.users
        .map((user) => {
          const newUser = { ...user };
          if (Array.isArray(newUser.roles)) {
            newUser.roles = newUser.roles[0];
          }
          return newUser;
        }).filter((user) => userRoles !== "Admin" || user.roles !== "Super Admin");

      return filteredUserData;
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(["users"], (prevUsers) =>
        prevUsers?.map((prevUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser
        )
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      // Send DELETE request to API endpoint
      const response = await fetch(
        `https://backend.tec.ampectech.com/api/users/${userId}`,
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

      // Return data if needed
      return data;
    },
    //client side optimistic update
    onMutate: (userId) => {
      queryClient.setQueryData(["users"], (prevUsers) =>
        prevUsers?.filter((user) => user.id !== userId)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["users"] }), //refetch users after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const EmpDetails = () => (
  //Put this with your other react-query providers near root of your app
  <div className="w-full">
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <QueryClientProvider client={queryClient}>
        <Example />
      </QueryClientProvider>
    </LocalizationProvider>
  </div>
);

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
    id: !validateRequired(user.em_name) ? "Job Id is Required" : "",
    // lastName: !validateRequired(user.lastName) ? "Last Name is Required" : "",
    // email: !validateEmail(user.email) ? "Incorrect Email Format" : "",
  };
}
