import React from "react";

const StatusEditModal = ({ isOpen, onClose, onSave, currentStatus }) => {
  const handleSave = (newStatus) => {
    onSave(newStatus);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Edit Employee Status</h2>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              currentStatus === "active"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleSave("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded ${
              currentStatus === "inactive"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleSave("inactive")}
          >
            Inactive
          </button>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default StatusEditModal;
