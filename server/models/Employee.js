const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@exinelabs\.com$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid email format for ExineLabs domain!`,
    },
  },

  joiningDate: {
    type: Date,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@exinelabs\.com$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid email format for ExineLabs domain!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
  designation: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "non-admin"],
    default: "non-admin",
  },

  dateOfBirth: {
    type: Date,
  },

  address: {
    type: String,
  },

  employeeId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  annualLeaveDays: {
    type: Number,
    default: 10, // Initialize with 10 days of annual leave
  },
  profilePicture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
