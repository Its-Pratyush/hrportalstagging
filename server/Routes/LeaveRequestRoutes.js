const express = require("express");
const router = express.Router();
const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/Employee");
const auth = require("../middleware/authenticate");

const transporter = require("../middleware/mailer");

//leave request routes
router.post("/leave-request", auth, async (req, res) => {
  const { startDate, endDate, reason, leaveType } = req.body;

  // Check if required fields are provided
  if (!startDate || !endDate || !reason || !leaveType) {
    return res.status(400).json({
      error: "Start date, end date, reason, and leave type are required",
    });
  }

  // Calculate the number of leave days requested
  const leaveDays = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  try {
    const user = await User.findById(req.user.id);

    // Check if the employee has enough annual leave days
    if (leaveType === "annual" && user.annualLeaveDays < leaveDays) {
      return res.status(400).json({
        error: "Insufficient annual leave days",
      });
    }

    const leaveRequest = new LeaveRequest({
      employeeId: req.user.id,
      startDate,
      endDate,
      reason,
      leaveType,
      status: "pending",
    });

    await leaveRequest.save();

    // Send email notification to the admins
    const mailOptions = {
      from: "pratyush.gogoi@exinelabs.com",
      to: "vinay@exinelabs.com, hurmath@exinelabs.com, pratyushgogoi3@gmail.com",
      subject: `Leave Request Notification - ${user.firstName} ${user.lastName}`,
      text: `Hello Vinay and Hurmath,

      You have received a leave request from ${user.firstName} ${user.lastName}
      for a period of ${leaveDays} days starting from ${startDate} to ${endDate}.
      
      Reason: ${reason}
      
      Click here to respond to this request: [URL to leave request application]

      Thank you.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res
      .status(201)
      .json({ message: "Leave request submitted successfully" });
  } catch (err) {
    console.error("Error saving leave request:", err);
    return res.status(400).json({ error: err.message });
  }
});

// Approve or Decline Leave Request
router.post("/leave-request/:id/status", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied");
  }

  const { status } = req.body;
  if (!["approved", "declined"].includes(status)) {
    return res.status(400).send("Invalid status");
  }

  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id).populate(
      "employeeId"
    );
    if (!leaveRequest) {
      return res.status(404).send("Leave request not found");
    }

    if (status === "approved" && leaveRequest.leaveType === "annual") {
      const leaveDays = Math.ceil(
        (new Date(leaveRequest.endDate).setHours(23, 59, 59) -
          new Date(leaveRequest.startDate).setHours(0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      );

      if (leaveRequest.employeeId.annualLeaveDays < leaveDays) {
        return res.status(400).send("Insufficient annual leave days");
      }

      leaveRequest.employeeId.annualLeaveDays -= leaveDays;
      await leaveRequest.employeeId.save();
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    res.send("Leave request updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get Leave Requests (Admin)
router.get("/get-leave-requests", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied");
  }

  try {
    const leaveRequests = await LeaveRequest.find().populate(
      "employeeId",
      "firstName lastName email employeeId "
    );
    res.send(leaveRequests);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// New route to get leave data for the authenticated employee
router.get("/user/leave-data", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json({
      totalAnnualLeave: user.annualLeaveDays,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get("/leave-history", auth, async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ employeeId: req.user.id });

    res.json(leaveRequests);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
