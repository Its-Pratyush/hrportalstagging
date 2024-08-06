const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "declined"],
    default: "Pending",
  },
});

const LeaveRequest = mongoose.model(`leaveRequest`, leaveRequestSchema);
module.exports = LeaveRequest;
