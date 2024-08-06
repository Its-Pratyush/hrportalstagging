import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLeaveRequests,
  updateLeaveRequestStatus,
} from "../redux/LeaveRequestslice";
const LeaveRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector(
    (state) => state.leaveRequests
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 7;

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  const handleApprove = (id) =>
    dispatch(updateLeaveRequestStatus({ id, status: "approved" }));
  const handleDecline = (id) =>
    dispatch(updateLeaveRequestStatus({ id, status: "declined" }));

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end - start;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;
    return differenceInDays;
  };

  // Pagination controls
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const TableHeader = ({ children }) => (
    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  );

  const TableDetails = ({ children }) => (
    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      {children}
    </td>
  );

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Leave Requests</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <TableHeader>EmployeeId</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Reason</TableHeader>
              <TableHeader>Days</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request._id}>
                <TableDetails>{request.employeeId?.employeeId}</TableDetails>
                <TableDetails>
                  {request.employeeId
                    ? `${request.employeeId.firstName} ${request.employeeId.lastName}`
                    : "N/A"}
                </TableDetails>
                <TableDetails>{request.employeeId?.email}</TableDetails>
                <TableDetails>{request.reason}</TableDetails>
                <TableDetails>
                  {calculateLeaveDays(request.startDate, request.endDate)}
                </TableDetails>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {request.status === "pending" ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                        onClick={() => handleApprove(request._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => handleDecline(request._id)}
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded ${
                        request.status === "approved"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination controls */}
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

export default LeaveRequests;
