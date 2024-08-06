// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlics";
import employeeReducer from "./EmployeeSlice";
import leaveRequestsReducer from "./LeaveRequestslice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    leaveRequests: leaveRequestsReducer,
  },
});

export default store;
