export const getEmailTemplate = (content) => {
  return `
<!doctype html>
<html>
  <head>
    <style>
      .body-container {
        font-family: Arial, sans-serif;
        margin: 0 0;
        padding: 80px 0;
        background-color: #e8e8e8;
        width: 100%;
        text-align: center;
      }
      .container {
        background-color: white;
        color: black;
        width: fit-content;
        max-width: 600px;
        padding: 50px 30px;
        margin: 0 auto;
        text-align: center;
        box-sizing: border-box;
      }
      .logo {
        max-width: 100px;
        margin-bottom: 40px;
      }
      .title {
        font-size: 32px;
        margin-bottom: 30px;
      }
      .block {
        border: 1px solid #1b1719;
        padding-top: 30px;
      }
      .message {
        font-size: 20px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
        a.cta-button{
        color: white !important;
        }
      .cta-button{
        background-color: #1b1719;
        color: white;
        padding: 15px 40px;
        text-decoration: none;
        border-radius: 30px;
        display: inline-block;
        margin: 30px 0;
        font-size: 18px;
        font-weight: bold;
      }
      .footer {
        font-size: 14px;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
  <div class="body-container">
    <div class="container">
      <img
        src="https://connect.intacnet.org/logo.png"
        alt="INTACT Logo"
        class="logo"
      />
      ${content}
      <div class="footer">
        Volunteers are always welcome to help with INTAC and INTAC Connect.
      </div>
      </div>
    </div>
  </body>
</html>
  `;
};

export const welcomeRegistration = (email) => {
  const emailContent = `
    <div class="title">Congratulations!</div>

    <div class="message">
      We are excited to invite you to join the INTAC Connect community
      platform, a networking space for INTAC alumni and friends.
    </div>

    <div class="message">
      Here you can create your profile, add contact information and links to
      your ongoing projects. You can find other alumni, stay in touch and hear
      about, or create, new opportunities to collaborate. There will
      eventually be a notice board for announcements where we can share
      updates, international calls for submission, opportunities to
      collaborate and other networking activities.
    </div>

    <div class="message">
      When you are ready to join,
      <a href="https://connect.intacnet.org/login">Login</a>
      using ${email} address to get started. Fill-in your profile, check the
      years you were active in INTAC and the shows you were in. Add contact
      links and sites for sharing your work. You can update your preferred
      email address, which is both your registration ID and login link.
    </div>

    <a href="https://connect.intacnet.org/" class="cta-button">JOIN THE COMMUNITY</a>

    <div class="message">
      The INTAC Connect platform is a volunteer effort and we hope that you
      will join to help build a vibrant community that supports all of us.
    </div>
  `;

  return {
    subject: "You have been invited to join Intac Connect!",
    text: `Hello ${email},\n\nWe are excited to invite you to join the INTAC Connect community platform, a networking space for INTAC alumni and friends.\n\nWhen you are ready to join, go to connect.intacnet.org and login using ${email} address to get started.\n\nBest regards,\nIntac Connect`,
    html: getEmailTemplate(emailContent),
  };
};

export const announcementEmail = (announcement) => {
  const emailContent = `
     <div class="title">New Announcement</div>

      <div class="message">
        A member of the INTAC community has posted a new announcement.
      </div>

      <div class="block">
        <div class="message">${announcement.title}</div>
        <div class="message">${announcement.subtitle}</div> 
        <a href="${announcement.ctaLink}" class="cta-button"
          >${announcement.ctaText}</a
        >
      </div>

      <div class="footer">
          <a href="https://connect.intacnet.org/a"
            >Browse all announcements</a
          >
      </div>
  `;

  return {
    subject: "Intac Connect Announcement",
    text: `New Announcement,\n\nA member of the INTAC community has posted a new announcement.\n\n${announcement.title}\n\n${announcement.subtitle}\n\n, to interact with the announcement, click here: ${announcement.ctaLink}`,
    html: getEmailTemplate(emailContent),
  };
};
