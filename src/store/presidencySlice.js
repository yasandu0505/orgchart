// store/presidencySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { presidents } from '../presidents';

const lastPresidentIndex = presidents.length - 1;
const lastPresident = presidents[lastPresidentIndex];
const lastDate = lastPresident?.dates[lastPresident.dates.length - 1]?.date ?? null;

const initialState = {
  selectedIndex: null,
  selectedDate: null,
  initialized: false,
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
    initializeSelection(state) {
      if (!state.initialized) {
        state.selectedIndex = lastPresidentIndex;
        state.selectedDate = lastDate;
        state.initialized = true;
      }
    },
  },
});

export const { setSelectedIndex, setSelectedDate, initializeSelection } = presidencySlice.actions;
export default presidencySlice.reducer;
