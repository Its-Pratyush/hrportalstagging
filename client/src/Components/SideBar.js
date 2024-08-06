import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarMinus,
  faUser,
  faSignOutAlt,
  faTasks,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

import { logout } from "../redux/AuthSlics";
import { fetchProfile } from "../redux/EmployeeSlice";

const Sidebar = ({ role }) => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const profile = useSelector((state) => state.employees.profile);
  const loading = useSelector((state) => state.employees.loading);
  const error = useSelector((state) => state.employees.error);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigateTo("/");
  };

  return (
    <div className="h-screen w-64 bg-[#2E8231] text-white flex flex-col justify-between">
      <div>
        <div className="p-4 bg-[#938557]">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="text-center mt-6">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error fetching profile</p>
          ) : profile ? (
            <>
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h2 className="mt-4 text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
            </>
          ) : null}
        </div>
        <nav className="mt-10">
          {role === "employee" ? (
            <>
              <NavLink
                to="/employeepanel"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
                end
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" /> Dashboard
              </NavLink>
              <NavLink
                to="/employeepanel/apply-leave"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
              >
                <FontAwesomeIcon icon={faCalendarMinus} className="mr-2" />{" "}
                Apply Leave
              </NavLink>
              <NavLink
                to="/employeepanel/profile"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/adminpanel"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
                end
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" /> Dashboard
              </NavLink>
              <NavLink
                to="/adminpanel/employeeDetails"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
              >
                <FontAwesomeIcon icon={faTasks} className="mr-2" /> Employee
                Details
              </NavLink>
              <NavLink
                to="/adminpanel/leaverequests"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />{" "}
                Leave Requests
              </NavLink>
              <NavLink
                to="/adminpanel/apply-leave"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
              >
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />{" "}
                Apply Leave
              </NavLink>
              <NavLink
                to="/adminpanel/profile"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
                activeClassName="bg-[#938557]"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
              </NavLink>
            </>
          )}
        </nav>
      </div>
      <div className="mb-5">
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded transition duration-200 hover:bg-[#938557] hover:text-white flex items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
