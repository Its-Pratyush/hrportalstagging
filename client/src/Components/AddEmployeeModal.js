import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addEmployee,
  setFlashMessage,
  clearFlashMessage,
} from "../redux/EmployeeSlice";

const AddEmployeeModal = ({ isOpen, onClose, onEmployeeAdded }) => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    salary: "",
    designation: "",
    role: "",
    joiningDate: "",
    dateOfBirth: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (formData.email) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        username: formData.email,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
    }
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "username",
      "designation",
      "role",
      "joiningDate",
    ];
    let valid = true;
    let newErrors = {};

    requiredFields.forEach((field) => {
      if (formData[field].trim() === "") {
        newErrors[field] = `Please fill the ${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      await dispatch(addEmployee(formData)).unwrap();
      onEmployeeAdded();
      handleClose();
      dispatch(setFlashMessage("Employee added successfully!"));
      setTimeout(() => dispatch(clearFlashMessage()), 3000);
    } catch (error) {
      console.error("Error adding employee:", error);
      if (error && error.errors) {
        const serverErrors = error.errors;
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...serverErrors,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general:
            error.message || "An unexpected error occurred. Please try again.",
        }));

        setTimeout(() => dispatch(clearFlashMessage()), 3000);
      }
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-10 rounded-lg w-2/3">
            <h2 className="text-lg font-bold mb-5 text-center">
              Add a new employee
            </h2>
            {errors.general && (
              <p className="text-red-500  italic mb-4 text-center">
                {errors.general}
              </p>
            )}
            <form onSubmit={handleSubmit}>
              {/* First Name and Last Name */}
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label htmlFor="firstName" className="block font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.firstName}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs italic">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="w-1/2 ml-2">
                  <label htmlFor="lastName" className="block font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.lastName}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs italic">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Joining Date and Email Address */}
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label htmlFor="joiningDate" className="block font-medium">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="joiningDate"
                    name="joiningDate"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.joiningDate}
                  />
                  {errors.joiningDate && (
                    <p className="text-red-500 text-xs italic">
                      {errors.joiningDate}
                    </p>
                  )}
                </div>
                <div className="w-1/2 ml-2">
                  <label htmlFor="email" className="block font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    placeholder="@exinelabs.com"
                    onChange={handleChange}
                    value={formData.email}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs italic">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Username and Designation */}
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label htmlFor="username" className="block font-medium">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.username}
                    readOnly
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs italic">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="w-1/2 ml-2">
                  <label htmlFor="designation" className="block font-medium">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.designation}
                  >
                    <option value="">Select Designation</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="SEO Expert">SEO Expert</option>
                    <option value="SEO Analyst">SEO Analyst</option>
                    <option value="CEO">CEO</option>
                    <option value="Project Manager">Project Manager</option>
                  </select>
                  {errors.designation && (
                    <p className="text-red-500 text-xs italic">
                      {errors.designation}
                    </p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="flex mb-4">
                <div className="w-full">
                  <label htmlFor="role" className="block font-medium">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.role}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="non-admin">Employee</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs italic">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Salary */}
              <div className="flex mb-4">
                <div className="w-1/2 mr-2">
                  <label htmlFor="salary" className="block font-medium">
                    Salary
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.salary}
                  />
                </div>

                {/* Date of Birth */}

                <div className="w-1/2 mr-2">
                  <label htmlFor="dateOfBirth" className="block font-medium">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.dateOfBirth}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex mb-4">
                <div className="w-full">
                  <label htmlFor="address" className="block font-medium">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500"
                    onChange={handleChange}
                    value={formData.address}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmployeeModal;
