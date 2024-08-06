import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddEmployeeModal from "./AddEmployeeModal";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import { Link } from "react-router-dom";
import {
  fetchEmployees,
  updateEmployeeStatus,
  setStatusFilter,
  setCurrentPage,
  setFlashMessage,
  clearFlashMessage,
} from "../redux/EmployeeSlice";

const EmployeeDetails = () => {
  const dispatch = useDispatch();
  const {
    list: employees,
    statusFilter,
    currentPage,
    flashMessage,
  } = useSelector((state) => state.employees);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const employeesPerPage = 10;

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openDetailsModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDropdownClick = (index) =>
    setDropdownVisible(dropdownVisible === index ? null : index);

  const handleToggleStatus = (employee) => {
    const newStatus = employee.status === "active" ? "inactive" : "active";
    dispatch(updateEmployeeStatus({ employeeId: employee._id, newStatus }));
    dispatch(
      setFlashMessage(
        `Employee ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully!`
      )
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const TableHeader = ({ children }) => (
    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  );

  const TableDetails = ({ children }) => (
    <td className="py-2 px-4 border-b border-gray-300">{children}</td>
  );

  const filteredEmployees = employees.filter((employee) =>
    statusFilter === "all" ? true : employee.status === statusFilter
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) dispatch(setCurrentPage(currentPage + 1));
  };

  const prevPage = () => {
    if (currentPage > 1) dispatch(setCurrentPage(currentPage - 1));
  };

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        dispatch(clearFlashMessage());
      }, 3000); // Clear the flash message after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [flashMessage, dispatch]);

  return (
    <div className="m-5 container mx-auto p-6 bg-gray-100">
      {flashMessage && (
        <div className="mb-4 text-center bg-green-200 text-green-700">
          {flashMessage}
        </div>
      )}
      <h1 className="text-center text-2xl font-bold mb-6">Employee Details</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-[#82A943] text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={openAddModal}
        >
          + Add Employee
        </button>
        <div>
          <label htmlFor="statusFilter" className="mr-2 font-semibold">
            Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-gray-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onEmployeeAdded={() => dispatch(fetchEmployees())}
      />
      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        employee={selectedEmployee}
      />
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <TableHeader>EmployeeID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Designation</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Joined Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader></TableHeader>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <TableDetails>{employee.employeeId}</TableDetails>
                <TableDetails>{employee.firstName}</TableDetails>
                <TableDetails>{employee.designation}</TableDetails>
                <TableDetails>{employee.email}</TableDetails>
                <TableDetails>{formatDate(employee.joiningDate)}</TableDetails>
                <TableDetails>
                  <span
                    className={`text-${
                      employee.status === "active" ? "green" : "red"
                    }-500`}
                  >
                    {employee.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableDetails>
                <td className="py-2 px-4 border-b border-gray-300 text-right relative">
                  <button
                    onClick={() => handleDropdownClick(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &#x22EE;
                  </button>
                  {dropdownVisible === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                      <Link
                        to="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => handleToggleStatus(employee)}
                      >
                        {employee.status === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </Link>
                      <Link
                        to="#"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => openDetailsModal(employee)}
                      >
                        View Employee
                      </Link>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
