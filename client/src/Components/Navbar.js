import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import PasswordResetModal from "./PasswordResetModal";
import { fetchEmployees } from "../redux/EmployeeSlice";

const Navbar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();

  const getTitle = () => {
    switch (location.pathname) {
      case "/employeepanel":
        return "Dashboard";
      case "/employeepanel/apply-leave":
        return "Apply Leave";
      case "/employeepanel/profile":
        return "Profile";
      case "/adminpanel":
        return "Dashboard";
      case "/adminpanel/employeeDetails":
        return "Employee Details";
      case "/adminpanel/leaverequests":
        return "Leave Requests";
      case "/adminpanel/profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  const showSearchBar = () => {
    return location.pathname === "/adminpanel/employeeDetails";
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsSettingsOpen(false);
  };

  const toggleSettingsDropdown = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsNotificationOpen(false);
  };

  const openPasswordResetModal = () => {
    setIsPasswordResetModalOpen(true);
    setIsSettingsOpen(false);
  };

  const closePasswordResetModal = () => {
    setIsPasswordResetModalOpen(false);
  };

  const handleSearch = () => {
    const isEmployeeId = /^EL\d+$/.test(searchQuery);
    dispatch(
      fetchEmployees({
        employeeId: isEmployeeId ? searchQuery : "",
        name: isEmployeeId ? "" : searchQuery,
      })
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 relative">
      <div className="text-2xl font-semibold text-black">{getTitle()}</div>

      {showSearchBar() && (
        <div className="flex-grow mx-4 relative">
          <input
            type="text"
            placeholder="Search (active/inactive)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 pl-10 rounded bg-gray-200 text-black focus:outline-none focus:bg-gray-300"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="focus:outline-none"
            onClick={toggleNotificationDropdown}
          >
            <FontAwesomeIcon icon={faBell} className="text-xl text-black" />
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100">Notification 1</li>
                <li className="px-4 py-2 hover:bg-gray-100">Notification 2</li>
                <li className="px-4 py-2 hover:bg-gray-100">Notification 3</li>
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="focus:outline-none"
            onClick={toggleSettingsDropdown}
          >
            <FontAwesomeIcon icon={faCog} className="text-xl text-black" />
          </button>
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <ul className="py-1">
                <li
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={openPasswordResetModal}
                >
                  Reset Password
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={closePasswordResetModal}
      />
    </div>
  );
};

export default Navbar;
