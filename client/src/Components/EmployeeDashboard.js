import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Employee Dashboard
      </h1>
      <div className="flex justify-center space-x-6">
        <Link
          to="/employeepanel/apply-leave"
          className="bg-white rounded-lg shadow-lg p-6 w-64 text-center transform hover:-translate-y-2 transition duration-200"
        >
          <FontAwesomeIcon
            icon={faClipboardList}
            size="3x"
            className="text-blue-500 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Apply Leave
          </h2>
          <p className="text-gray-600">Apply for leave</p>
        </Link>
        <Link
          to="/employeepanel/profile"
          className="bg-white rounded-lg shadow-lg p-6 w-64 text-center transform hover:-translate-y-2 transition duration-200"
        >
          <FontAwesomeIcon
            icon={faUserEdit}
            size="3x"
            className="text-blue-500 mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile</h2>
          <p className="text-gray-600">Update your profile information</p>
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
