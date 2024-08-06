import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { updateEmployeeDetails } from "../redux/EmployeeSlice";

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState({
    salary: false,
    address: false,
    role: false,
    designation: false,
  });
  const [updatedFields, setUpdatedFields] = useState({
    salary: "",
    address: "",
    role: "",
    designation: "",
  });

  useEffect(() => {
    if (employee) {
      setUpdatedFields({
        salary: employee.salary,
        address: employee.address,
        role: employee.role,
        designation: employee.designation,
      });
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    dispatch(updateEmployeeDetails({ employeeId: employee._id, updatedFields }))
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Error updating employee details:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl z-50">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Employee Details
        </h2>
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <img
              src={
                "http://localhost:5000/profileimages/" + employee.profilePicture
              }
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="mb-4">
              <strong>Employee ID:</strong> {employee.employeeId}
            </div>
            <div className="mb-4">
              <strong>Name:</strong> {employee.firstName} {employee.lastName}
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {employee.email}
            </div>
            <div className="mb-4">
              <strong>Joined Date:</strong>{" "}
              {new Date(employee.joiningDate).toLocaleDateString()}
            </div>
            <div className="mb-4">
              <strong>Status:</strong> {employee.status}
            </div>
            <div className="mb-4">
              <strong>Date of Birth:</strong>{" "}
              {new Date(employee.dateOfBirth).toLocaleDateString()}
            </div>
            <div className="mb-4">
              <strong>Role:</strong>
              {isEditing.role ? (
                <input
                  type="text"
                  name="role"
                  value={updatedFields.role}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  {employee.role}
                  <button onClick={() => handleEditClick("role")}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="ml-2 text-gray-500"
                    />
                  </button>
                </>
              )}
            </div>
            <div className="mb-4">
              <strong>Designation:</strong>
              {isEditing.designation ? (
                <input
                  type="text"
                  name="designation"
                  value={updatedFields.designation}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  {employee.designation || "N/A"}
                  <button onClick={() => handleEditClick("designation")}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="ml-2 text-gray-500"
                    />
                  </button>
                </>
              )}
            </div>
            <div className="mb-4">
              <strong>Salary:</strong>
              {isEditing.salary ? (
                <input
                  type="text"
                  name="salary"
                  value={updatedFields.salary}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  {employee.salary}
                  <button onClick={() => handleEditClick("salary")}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="ml-2 text-gray-500"
                    />
                  </button>
                </>
              )}
            </div>
            <div className="mb-4">
              <strong>Address:</strong>
              {isEditing.address ? (
                <input
                  type="text"
                  name="address"
                  value={updatedFields.address}
                  onChange={handleInputChange}
                />
              ) : (
                <>
                  {employee.address}
                  <button onClick={() => handleEditClick("address")}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="ml-2 text-gray-500"
                    />
                  </button>
                </>
              )}
            </div>
            <div className="mb-4">
              <strong>Annual Leave Days:</strong> {employee.annualLeaveDays}
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;
