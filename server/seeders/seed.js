const db = require("../config/connection");
const {
  User,
  AlumProfile,
  School,
  SocialMediaPlatform,
  SocialMediaLink,
  Exhibition,
  ExhibitionReference,
} = require("../models");
const schoolsSeeds = require("./schoolSeeds.json");
const socialMediaSeeds = require("./socialMediaSeeds.json");
const exhibitionSeeds = require("./exhibitionsSeeds.json");

//const cleanDB = require("./cleanDB");

db.once("open", async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await AlumProfile.deleteMany({});
    await School.deleteMany({});
    await SocialMediaPlatform.deleteMany({});
    await Exhibition.deleteMany({});
    await SocialMediaLink.deleteMany({});
    await ExhibitionReference.deleteMany({});

    // Insert Schools
    const schoolsDocs = await School.insertMany(schoolsSeeds);

    const schoolIds = schoolsDocs.map((school) => school._id);
    console.log("------  School seeded! -------");

    // Insert Social Media
    const socialMediaDocs = await SocialMediaPlatform.insertMany(socialMediaSeeds);
    const socialMediaPlatformIds = socialMediaDocs.map((socialMedia) => socialMedia._id);
    console.log("------  Social Media Platform seeded! -------");

    // InsertExhibitions
    const exhibitionDocs = await Exhibition.insertMany(exhibitionSeeds);
    const exhibitionIds = exhibitionDocs.map((exhibition) => exhibition._id);
    console.log("------ Exhibitions seeded! -------");

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
      {
        email: "svny2art@gmail.com",
        school: schoolIds[0],
        years: [2011, 2015],
        register: true,
        designationRole: "Student",
        isAdmin: true,
      },
    ]);
    const userIds = userDocs.map((user) => user._id);
    console.log("------ User Data seeded! -------");

    //Insert Social Media Links
    const socialLinksDocs = await SocialMediaLink.insertMany([
      {
        socialMediaPlatform: socialMediaPlatformIds[0],
        urlLink: "https://www.linkedin.com/in/johndoe",
      },
      {
        socialMediaPlatform: socialMediaPlatformIds[1],
        urlLink: "https://twitter.com/janesculpt",
      },
      {
        socialMediaPlatform: socialMediaPlatformIds[0],
        urlLink: "https://www.linkedIn.com/alexjones",
      },
    ]);
    const socialMediaLinksIds = socialLinksDocs.map((link) => link._id);
    console.log("------ Social Media Links seeded! -------");

    const alumDocs = await AlumProfile.insertMany([
      {
        firstName: "John",
        lastName: "Doe",
        bio: "An artist passionate about modern art.",
        public: true,
        websiteLinks: [
          { urlLink: "https://www.johndoeart.com", description: "Portfolio" },
          { urlLink: "https://www.instagram.com/johndoe", description: "The blog" },
        ],
        exhibitions: [exhibitionIds[0]],
        socialMedia: [socialMediaLinksIds[2]],
        user: userIds[0],
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        bio: "Sculptor with a focus on contemporary pieces.",
        public: true,
        websiteLinks: [
          { urlLink: "https://www.janesmithsculpture.com", description: "Portfolio" },
        ],
        exhibitions: [exhibitionIds[0], exhibitionIds[1]],
        socialMedia: [socialMediaLinksIds[0], socialMediaLinksIds[1]],
        user: userIds[1],
      },
    ]);
    const alumIds = alumDocs.map((a) => a._id);
    console.log("------ AlumProfiles seeded! -------");

    //Insert Exhibition References Links
    const exhibitionReferenceLinkDocs = await ExhibitionReference.insertMany([
      {
        exhibition: exhibitionIds[0],
        alumProfile: alumIds[0],
        referenceLink: "https://www.somethingcool.com/",
      },
      {
        exhibition: exhibitionIds[1],
        alumProfile: alumIds[1],
        referenceLink: "https://www.watermeloool.com/",
      },
      {
        exhibition: exhibitionIds[1],
        alumProfile: alumIds[0],
        referenceLink: "https://www.strawberry.com/",
      },
    ]);
    const exhibitionReferenceLinksIds = exhibitionReferenceLinkDocs.map(
      (refLink) => refLink._id
    );
    console.log("------ Exhibition References Links seeded! -------");

    // Update each AlumProfile to include references to the ExhibitionReferences
    for (const ref of exhibitionReferenceLinkDocs) {
      await AlumProfile.findByIdAndUpdate(
        ref.alumProfile,
        {
          $push: { exhibitionsReferences: ref._id },
        },
        { new: true } // Return the updated document
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("Database seeded successfully!");
  process.exit(0);
});
