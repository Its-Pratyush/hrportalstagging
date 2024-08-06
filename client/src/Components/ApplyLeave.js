import React, { useState, useEffect } from "react";
import LeaveFormModal from "./LeaveFromModal";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ApplyLeave = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [annualLeaveLeft, setAnnualLeaveLeft] = useState(0);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const totalAnnualLeave = 10;

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/leave/user/leave-data",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leave data");
        }

        const data = await response.json();
        setAnnualLeaveLeft(data.totalAnnualLeave);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    const fetchLeaveHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/leave/leave-history",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leave history");
        }

        const data = await response.json();
        setLeaveHistory(data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      }
    };

    fetchLeaveData();
    fetchLeaveHistory();
  }, []);

  const handleLeaveSubmit = (leaveRequest) => {
    console.log("Leave Request:", leaveRequest);
    if (leaveRequest.leaveType === "annual") {
      setAnnualLeaveLeft((prev) => prev - leaveRequest.leaveDays);
    }
    setModalIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Annual Leave Tracker</h2>
        <div className="flex justify-center items-center mb-4">
          <div style={{ width: 150, height: 150 }}>
            <CircularProgressbar
              value={annualLeaveLeft}
              maxValue={totalAnnualLeave}
              text={`${annualLeaveLeft} days`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: annualLeaveLeft > 2 ? "green" : "red",
                textColor: annualLeaveLeft > 2 ? "green" : "red",
                trailColor: "#d6d6d6",
              })}
            />
          </div>
        </div>
        <p className="text-lg">
          You have <strong>{annualLeaveLeft}</strong> out of{" "}
          <strong>{totalAnnualLeave}</strong> annual leave days left.
        </p>
      </div>
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Apply Leave
      </button>
      <LeaveFormModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onSubmit={handleLeaveSubmit}
      />
      <div className="mt-10 w-full">
        <h2 className="text-xl font-bold mb-4">Leave Request History</h2>
        <div className="overflow-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((leave) => (
                <tr key={leave._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {leave.reason}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {leave.leaveType}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                        leave.status === "approved"
                          ? "text-green-900 bg-green-200"
                          : leave.status === "declined"
                          ? "text-red-900 bg-red-200"
                          : "text-yellow-900 bg-yellow-200"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 opacity-50 rounded-full"
                      ></span>
                      <span className="relative">{leave.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
