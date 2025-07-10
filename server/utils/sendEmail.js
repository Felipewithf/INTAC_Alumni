const nodemailer = require("nodemailer");
const { getEmailTemplate } = require("./contentForEmails");

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
    const emailContent = `
      <div class="title">Login to Intac Connect</div>
      
      <div class="message">
        Click the button below to securely log in to your account.
      </div>
      
      <a href="${magicLink}" class="cta-button">LOG IN NOW</a>
      
      <div class="message">
        This login link will expire in 15 minutes for security purposes.
        If you didn't request this login link, you can safely ignore this email.
      </div>
    `;

    const mailOptions = {
      from: "Intac Connect",
      to: email,
      subject: "Your Magic Link",
      text: `Click the following link to log in: ${magicLink}`,
      html: getEmailTemplate(emailContent),
    };

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
