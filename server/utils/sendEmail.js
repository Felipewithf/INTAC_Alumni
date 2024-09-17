const nodemailer = require("nodemailer");

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can change this to your email provider or use a custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or an app-specific password if using Gmail
  },
});

/**
 * Send an email with the magic link
 * @param {String} email - Recipient's email address
 * @param {String} magicLink - The magic link URL for logging in
 */
const sendMagicLinkEmail = async (email, magicLink) => {
  try {
    const mailOptions = {
      from: '"Your App Name" <your-email@example.com>', // sender address
      to: email, // recipient's email
      subject: "Your Magic Link", // Subject line
      text: `Click the following link to log in: ${magicLink}`, // plain text body
      html: `<p>Click the following link to log in:</p><a href="${magicLink}">Log in with Magic Link</a>`, // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${email}`, info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMagicLinkEmail;
