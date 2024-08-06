import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://16.171.151.62:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Thunk to fetch leave requests
export const fetchLeaveRequests = createAsyncThunk(
  "leaveRequests/fetchLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/leave/get-leave-requests");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to update leave request status
export const updateLeaveRequestStatus = createAsyncThunk(
  "leaveRequests/updateLeaveRequestStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/leave/leave-request/${id}/status`,
        { status }
      );
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const leaveRequestsSlice = createSlice({
  name: "leaveRequests",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeaveRequestStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const existingRequest = state.requests.find(
          (request) => request._id === id
        );
        if (existingRequest) {
          existingRequest.status = status;
        }
      })
      .addCase(updateLeaveRequestStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default leaveRequestsSlice.reducer;
