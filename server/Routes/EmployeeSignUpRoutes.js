const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable
const transporter = require("../middleware/mailer");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

// Import models
const Employee = require("../models/Employee");
const LeaveRequest = require("../models/LeaveRequest");

// Authentication middleware
const auth = require("../middleware/authenticate");

// Function to generate unique employee ID (placeholder function)
async function generateUniqueEmployeeId() {
  let unique = false;
  let employeeId;
  const prefix = "EL";
  const length = 3; // Number of digits in the ID

  while (!unique) {
    // Get the highest existing ID number
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
    const lastIdNumber = lastEmployee
      ? parseInt(lastEmployee.employeeId.replace(prefix, ""))
      : 0;

    // Generate the next ID number and pad with leading zeros
    const nextIdNumber = lastIdNumber + 1;
    const paddedIdNumber = String(nextIdNumber).padStart(length, "0");

    employeeId = `${prefix}${paddedIdNumber}`;
    const existingEmployee = await Employee.findOne({ employeeId });
    if (!existingEmployee) {
      unique = true;
    }
  }

  return employeeId;
}

const generateRandomPassword = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Route to create an Employee
router.post("/create-Employees", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      joiningDate,
      username,
      salary,
      role,
      designation, // Include designation in the destructuring
      dateOfBirth,
      address,
    } = req.body;

    // Check if all required fields are provided
    if (
      !firstName ||
      !lastName ||
      !email ||
      !joiningDate ||
      !username ||
      !role ||
      !designation
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const password = generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(password, 10);
    const employeeId = await generateUniqueEmployeeId(); // Generate a unique employee ID

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      joiningDate,
      username,
      salary,
      role,
      designation, // Include designation in the newEmployee object
      dateOfBirth,
      address,
      employeeId,
      status: "active", // Set default status
    });

    await newEmployee.save();

    const token = jwt.sign(
      { id: newEmployee._id, role: newEmployee.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send email notification to the admins
    const mailOptions = {
      from: "",
      to: [email, "pratyushgogoi3@gmail.com"],
      subject: "Your Account Credentials",
      text: `Hello ${username},\n\nYour account has been created. Here are your login credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nPlease log in and change your password immediately.\n\nBest Regards,\nExine Labs`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Email must be unique",
      });
    } else {
      console.error("Error creating Employee:", error);
      res.status(500).json({ message: "Error creating Employee" });
    }
  }
});

// Route for Employee login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (employee.status === "inactive") {
      return res.status(403).json({
        message: "Your portal is currently inactive. Please contact the admin.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, role: employee.role });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Route to get all Employees
router.get("/get-Employees", auth, async (req, res) => {
  // Check if the Employee is authenticated and has the 'admin' role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    // Fetch all Employees from the database in reverse order
    const employees = await Employee.find().sort({ _id: -1 });
    // Send the list of Employees as a JSON response
    res.json(employees);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching Employees:", error);
    // Send a 500 Internal Server Error status with an error message
    res.status(500).json({ message: "Error fetching Employees" });
  }
});

router.get("/employee/profile", auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select("-password"); // Exclude password from response
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ message: "Error fetching employee details" });
  }
});

// Route to reset password
router.post("/reset-password", auth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const employee = await Employee.findById(req.user.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.password = hashedPassword;
    await employee.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

// Route to update employee status
router.patch("/update-status/:id", auth, async (req, res) => {
  // Check if the user is authenticated and has the 'admin' role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }

  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (!status || !["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Find the employee by ID and update the status
    const employee = await Employee.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee status updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee status:", error);
    res.status(500).json({ message: "Error updating employee status" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profileimages");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.patch(
  "/update-profile",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const user = await Employee.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      console.log(req.file);
      user.profilePicture = req.file.filename; // Save the file path to the user document

      await user.save();

      res.json({ message: "Profile updated successfully", user });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ error: "Error updating profile" });
    }
  }
);

// Delete Employee (Admin)
router.delete("/deleteemployee/:id", auth, async (req, res) => {
  // Check if the user is authenticated and has the 'admin' role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if the employee is an admin
    if (employee.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

// Route to search employees by ID or name
router.get("/search-employees", auth, async (req, res) => {
  // Check if the user is authenticated and has the 'admin' role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }

  const { employeeId, name } = req.query;

  // Validate that at least one query parameter is provided
  if (!employeeId && !name) {
    return res.status(400).json({ message: "Employee ID or name is required" });
  }

  try {
    // Construct the search criteria based on provided query parameters
    let searchCriteria = {};

    if (employeeId) {
      searchCriteria.employeeId = employeeId;
    }

    if (name) {
      searchCriteria.$or = [
        { firstName: new RegExp(name, "i") }, // Case-insensitive search by first name
        { lastName: new RegExp(name, "i") }, // Case-insensitive search by last name
      ];
    }

    // Fetch employees matching the search criteria
    const employees = await Employee.find(searchCriteria);
    res.json(employees);
  } catch (error) {
    console.error("Error searching employees:", error);
    res.status(500).json({ message: "Error searching employees" });
  }
});

// Route to update employee details (salary, address, role, designation)
router.patch("/update-employee/:id", auth, async (req, res) => {
  // Check if the user is authenticated and has the 'admin' role
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }

  const { id } = req.params;
  const { salary, address, role, designation } = req.body;

  // Validate the provided fields (optional)
  if (!salary && !address && !role && !designation) {
    return res.status(400).json({ message: "At least one field is required" });
  }

  try {
    // Find the employee by ID and update the specified fields
    const updateFields = {};
    if (salary) updateFields.salary = salary;
    if (address) updateFields.address = address;
    if (role) updateFields.role = role;
    if (designation) updateFields.designation = designation;

    const employee = await Employee.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee details updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee details:", error);
    res.status(500).json({ message: "Error updating employee details" });
  }
});

module.exports = router;
