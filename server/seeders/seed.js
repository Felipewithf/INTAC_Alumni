const db = require("../config/connection");
const {
  User,
  StudentExhibition,
  SocialMedia,
  School,
  Alumni,
} = require("../models");
const schoolsSeeds = require("./schoolSeeds.json");
const socialMedias = require("./socialMediaSeeds.json");
const studentExhibitions = require("./studentExhibitionsSeeds.json");

const cleanDB = require("./cleanDB");

db.once("open", async () => {
  try {
    await User.deleteMany({});
    await Alumni.deleteMany({});
    await School.deleteMany({});
    await SocialMedia.deleteMany({});
    await StudentExhibition.deleteMany({});

    // Insert Schools
    const schoolsDocs = await School.insertMany(schoolsSeeds);

    const schoolIds = schoolsDocs.map((school) => school._id);
    console.log("------  School seeded! -------");

    // Insert Social Media
    const socialMediaDocs = await SocialMedia.insertMany(socialMedias);

    const socialMediaIds = socialMediaDocs.map(
      (socialMedia) => socialMedia._id
    );
    console.log("------  Social Media seeded! -------");

    // Insert Student Exhibitions
    const exhibitionDocs = await StudentExhibition.insertMany(
      studentExhibitions
    );
    const exhibitionIds = exhibitionDocs.map((exhibition) => exhibition._id);
    console.log("------ Student Exhibitions seeded! -------");

    // Insert Users
    const userDocs = await User.insertMany([
      {
        email: "john.doe@example.com",
        school: schoolIds[0],
        years: [2010, 2014],
        register: true,
        designationRole: "Faculty",
        isAdmin: true,
      },
      {
        email: "jane.smith@example.com",
        school: schoolIds[1],
        years: [2012, 2016],
        register: true,
        designationRole: "Student",
        isAdmin: false,
      },
      {
        email: "alex.jones@example.com",
        school: schoolIds[0],
        years: [2011, 2015],
        register: true,
        designationRole: "Faculty",
        isAdmin: true,
      },
    ]);
    const userIds = userDocs.map((user) => user._id);
    console.log("------ User Data seeded! -------");

    // Insert Alumni
    await Alumni.insertMany([
      {
        firstName: "John",
        lastName: "Doe",
        bio: "An artist passionate about modern art.",
        public: true,
        websiteLinks: [
          { urlLink: "https://www.johndoeart.com", description: "Portfolio" },
          {
            urlLink: "https://www.instagram.com/johndoe",
            description: "Instagram",
          },
        ],
        studentExhibitions: [
          {
            exhibition: exhibitionIds[0],
            references: [
              "https://www.example.com/review1",
              "https://www.example.com/review2",
            ],
          },
        ],
        socialMedia: [
          {
            platform: socialMediaIds[0],
            url: "https://www.linkedin.com/in/johndoe",
          },
          { platform: socialMediaIds[1], url: "" },
        ],
        user: userIds[0],
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        bio: "Sculptor with a focus on contemporary pieces.",
        public: true,
        websiteLinks: [
          {
            urlLink: "https://www.janesmithsculpture.com",
            description: "Portfolio",
          },
        ],
        studentExhibitions: [
          {
            exhibition: exhibitionIds[1],
            references: ["https://www.example.com/review3"],
          },
        ],
        socialMedia: [
          {
            platform: socialMediaIds[0],
            url: "https://www.linkedin.com/in/janesmith",
          },
          {
            platform: socialMediaIds[1],
            url: "https://twitter.com/janesculpt",
          },
        ],
        user: userIds[1],
      },
    ]);
    console.log("------ Alumni Data seeded! -------");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Database seeded successfully!");
  process.exit(0);
});
