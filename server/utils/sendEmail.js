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
      from: '"Intac Connect" <your-email@example.com>', // sender address
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

// send normal emails
const sendEmail = (mailOptions) => {
  let transporter = nodemailer.createTransport({
    service: "gmail", // You can change to another email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // let mailOptions = {
  //   from: "Intact Connect",
  //   to: email,
  //   subject: subject,
  //   text: body,
  // };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};

// Export both functions as part of an object
module.exports = {
  sendEmail,
  sendMagicLinkEmail,
};
