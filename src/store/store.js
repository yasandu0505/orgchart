import { configureStore } from '@reduxjs/toolkit';
import presidencyReducer from './presidencySlice';

const store = configureStore({
  reducer: {
    presidency: presidencyReducer,
    
  },
});

export default store;