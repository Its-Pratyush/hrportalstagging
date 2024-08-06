import React from "react";
import Sidebar from "../Components/SideBar";

import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import ApplyLeave from "../Components/ApplyLeave";
import Profile from "../Components/Profile";
import EmployeeDashboard from "../Components/EmployeeDashboard";

const EmployeePanel = ({ children }) => {
  return (
    <>
      <div className="flex flex-row bg-gray-100">
        <Sidebar role="employee" />
        <div className="flex-grow ">
          <Navbar />
          <Routes>
            <Route path="/" element={<EmployeeDashboard />} />
            <Route path="/apply-leave" element={<ApplyLeave />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default EmployeePanel;
