import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/EmployeeSlice";
import UpdateProfileModal from "./UpdateProfileModal";

const Profile = () => {
  const dispatch = useDispatch();
  const {
    profile: user,
    loading,
    error,
  } = useSelector((state) => state.employees);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="mt-20 bg-gray-100 flex flex-col items-center py-10 ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl text-center">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
        </div>
        <div className="mt-6 text-left">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 font-semibold">Email</label>
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold">Role</label>
              <p className="text-gray-800">{user.role}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold">
                Joining Date
              </label>
              <p className="text-gray-800">
                {new Date(user.joiningDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold">
                Date of Birth
              </label>
              <p className="text-gray-800">
                {new Date(user.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold">
                Address
              </label>
              <p className="text-gray-800">{user.address}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold">
                Employee ID
              </label>
              <p className="text-gray-800">{user.employeeId}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold">
                Status
              </label>
              <p className="text-gray-800">{user.status}</p>
            </div>
            <div>
              <label className="block text-gray-600 font-semibold">
                Annual Leave Days Left
              </label>
              <p className="text-gray-800">{user.annualLeaveDays}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
