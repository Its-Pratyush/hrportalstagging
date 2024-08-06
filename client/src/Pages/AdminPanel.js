import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../Components/SideBar";
import Navbar from "../Components/Navbar";
import { Routes, Route } from "react-router-dom";
import EmployeeDetails from "../Components/Employee_deatails";
import LeaveRequests from "../Components/Leave_Requests";
import Profile from "../Components/Profile";
import AdminDashboard from "../Components/AdminDashboard";
import ApplyLeave from "../Components/ApplyLeave";
import { fetchEmployees } from "../redux/EmployeeSlice";

const AdminPanel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  return (
    <div className="flex flex-row bg-gray-100">
      <Sidebar role="admin" />
      <div className="flex-grow">
        <Navbar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/employeeDetails" element={<EmployeeDetails />} />
          <Route path="/leaverequests" element={<LeaveRequests />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
