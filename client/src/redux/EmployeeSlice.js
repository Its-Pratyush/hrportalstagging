import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://51.20.231.163:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Async thunk for fetching employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async ({ employeeId = "", name = "" } = {}, { rejectWithValue }) => {
    try {
      let url = "/user/get-Employees";
      if (employeeId || name) {
        url = `/user/search-employees?`;
        if (employeeId) url += `employeeId=${employeeId}&`;
        if (name) url += `name=${name}`;
      }
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for updating employee status
export const updateEmployeeStatus = createAsyncThunk(
  "employees/updateEmployeeStatus",
  async ({ employeeId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/user/update-status/${employeeId}`,
        { status: newStatus }
      );
      return { employeeId, newStatus };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for fetching profile
export const fetchProfile = createAsyncThunk(
  "employees/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/employee/profile");
      const data = response.data;
      data.profilePicture = `${BASE_URL}/profileimages/${data.profilePicture}`;
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for adding a new employee
export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/user/create-Employees",
        employeeData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "An unexpected error occurred. Please try again.",
        }
      );
    }
  }
);

// Async thunk for updating employee details
export const updateEmployeeDetails = createAsyncThunk(
  "employees/updateEmployeeDetails",
  async ({ employeeId, updatedFields }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/user/update-employee/${employeeId}`,
        updatedFields
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: false,
    error: null,
    statusFilter: "all",
    currentPage: 1,
    flashMessage: "",
    profile: null,
  },
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFlashMessage: (state, action) => {
      state.flashMessage = action.payload;
    },
    clearFlashMessage: (state) => {
      state.flashMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
        const { employeeId, newStatus } = action.payload;
        const employee = state.list.find((emp) => emp._id === employeeId);
        if (employee) employee.status = newStatus;
      })
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployeeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeDetails.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEmployee = action.payload;
        const existingEmployee = state.list.find(
          (emp) => emp._id === updatedEmployee._id
        );
        if (existingEmployee) {
          Object.assign(existingEmployee, updatedEmployee);
        }
      })
      .addCase(updateEmployeeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setStatusFilter,
  setCurrentPage,
  setFlashMessage,
  clearFlashMessage,
} = employeeSlice.actions;

export default employeeSlice.reducer;
