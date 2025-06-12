import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedIndex: 0,         
  selectedDate: null,      
};

const presidencySlice = createSlice({
  name: 'presidency',
  initialState,
  reducers: {
    setSelectedIndex(state, action) {
      state.selectedIndex = action.payload;
      state.selectedDate = null;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedIndex, setSelectedDate } = presidencySlice.actions;
export default presidencySlice.reducer;
