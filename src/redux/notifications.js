import { createSlice } from "@reduxjs/toolkit";

export const userNotification = createSlice({
  name: "userNotification",
  initialState: {
    notification: [],
    editable: false,
  },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    setEditable: (state, action) => {
      state.editable = action.payload;
      //when i unmount from that job sheet i should set editable to false
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNotification, setEditable } = userNotification.actions;

export default userNotification.reducer;
