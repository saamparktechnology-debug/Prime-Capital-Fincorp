const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const NotificationService = {
  async sendEmail(to, subject, htmlContent) {
    try {
      if (!to) {
        console.error("Email recipient is missing.");
        return false;
      }

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Email credentials are missing in .env");
        return false;
      }

      const info = await transporter.sendMail({
        from: `"Microfinance System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
      });

      console.log("Email sent:", info.messageId);

      return true;
    } catch (error) {
      console.error("Email Send Error:", error);
      return false;
    }
  },

  async sendSMS(phoneNumber, message) {
    try {
      if (!phoneNumber) {
        console.error("Phone number is missing.");
        return false;
      }

      // SMS gateway integration goes here
      console.log(
        `[SMS GATEWAY SIMULATION] To: ${phoneNumber} | Message: ${message}`,
      );

      return true;
    } catch (error) {
      console.error("SMS Send Error:", error);
      return false;
    }
  },
};

module.exports = NotificationService;
