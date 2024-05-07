import { createSlice } from "@reduxjs/toolkit";

export const currentJobs = createSlice({
  name: "currentJobs",
  initialState: {
    jobs: [],
  },
  reducers: {
    setJobs: (state, action) => {
      const extractedData = action.payload?.map(
        ({ job_number, job_location }) => ({
          job_number,
          job_location,
        })
      );
      state.jobs = extractedData;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setJobs } = currentJobs.actions;

export default currentJobs.reducer;
