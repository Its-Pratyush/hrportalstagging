// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other email services
  auth: {
    user: "pratyush.gogoi@exinelabs.com", // Your email address
    pass: "juuv nunj ixzc ildy", // Your email password or app password
  },
});

module.exports = transporter;
