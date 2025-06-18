import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  allDepartmentData: [],
  departmentHistory: {}  // <-- add this
};

const allDepartmentDataSlice = createSlice({
  name: "allDepartmentData",
  initialState,
  reducers: {
    setAllDepartmentData(state, action) {
      state.allDepartmentData = action.payload;
    },
    setDepartmentHistory(state, action) {  // <-- add this
      state.departmentHistory = action.payload;
    }
  }
});

export const { setAllDepartmentData, setDepartmentHistory } = allDepartmentDataSlice.actions;
export default allDepartmentDataSlice.reducer;
