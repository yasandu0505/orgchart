import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    allDepartmentData: []
}

const allDepartmentDataSlice = createSlice({
    name: 'allDepartmentData',
    initialState,
    reducers: {
        setAllDepartmentData(state, action){
            state.allDepartmentData = action.payload;
        }
    }
})

export const {setAllDepartmentData} = allDepartmentDataSlice.actions;
export default allDepartmentDataSlice.reducer;