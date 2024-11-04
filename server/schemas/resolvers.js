const {
  User,
  AlumProfile,
  School,
  Exhibition,
  SocialMediaLink,
  SocialMediaPlatform,
  ExhibitionReference,
} = require("../models");
const sendMagicLinkEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    getUsers: async () => {
      return await User.find().populate("school");
    },
    getUserById: async (_, { id }) => {
      return await User.findById(id).populate("school");
    },
    getLoggedInUser: async (_, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in!");
      }
      return User.findById(context.user.id);
    },
    getSchools: async () => {
      return await School.find();
    },
    getSchoolById: async (_, { id }) => {
      return await School.findById(id);
    },
    getAlumProfiles: async () => {
      return await AlumProfile.find()
        .populate("user")
        .populate("exhibitions")
        .populate({
          path: "exhibitionsReferences",
          populate: {
            path: "exhibition",
            model: "Exhibition",
          },
        })
        .populate({
          path: "socialMedia",
          populate: {
            path: "socialMediaPlatform", // Specify the field to populate within `socialMedia`
            model: "SocialMediaPlatform", // Ensure the model name matches the one registered in Mongoose
          },
        });
    },
    getAlumProfileById: async (_, { id }) => {
      return await AlumProfile.findById(id)
        .populate("user")
        .populate("exhibitions")
        .populate({
          path: "exhibitionsReferences",
          populate: {
            path: "exhibition",
            model: "Exhibition",
          },
        })
        .populate({
          path: "socialMedia",
          populate: {
            path: "socialMediaPlatform", // Specify the field to populate within `socialMedia`
            model: "SocialMediaPlatform", // Ensure the model name matches the one registered in Mongoose
          },
        });
    },
    getExhibitions: async () => {
      return await Exhibition.find();
    },
    getExhibitionById: async (_, { id }) => {
      return await Exhibition.findById(id);
    },
    getSocialMediaPlatforms: async () => {
      return await SocialMediaPlatform.find();
    },
    getSocialMediaPlatformById: async (_, { id }) => {
      return await SocialMediaPlatform.findById(id);
    },
    getSocialMediaLinks: async () => {
      return await SocialMediaLink.find().populate("socialMediaPlatform");
    },
    getSocialMediaLinkById: async (_, { id }) => {
      return await SocialMediaLink.findById(id).populate("socialMediaPlatform");
    },
    getExhibitionReferences: async () => {
      return await ExhibitionReference.find()
        .populate("alumProfile")
        .populate("exhibition");
    },
    getExhibitionReferenceById: async (_, { id }) => {
      return await ExhibitionReference.findById(id)
        .populate("alumProfile")
        .populate("exhibition");
    },
  },

  Mutation: {
    sendMagicLink: async (_, { email }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      const token = user.generateMagicToken();
      await user.save();

      const magicLink = `${process.env.DOMAIN}magic-login?token=${token}`;
      // Send the magic link email

      await sendMagicLinkEmail(email, magicLink);

      return "Magic link sent!";
    },
    verifyMagicLink: async (_, { token }) => {
      const user = await User.findOne({
        magicToken: token,
        tokenExpiresAt: { $gte: Date.now() },
      });

      if (!user) {
        throw new Error("Invalid or expired token");
      }

      user.magicToken = null; // Clear the token after successful login
      user.tokenExpiresAt = null;
      await user.save();

      const authToken = jwt.sign(
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      return {
        token: authToken,
        user,
      };
    },
    // ------- create *******
    createUser: async (
      _,
      { email, schoolId, years, register, designationRole, isAdmin }
    ) => {
      const school = await School.findById(schoolId);
      const user = new User({
        email,
        school,
        years,
        register,
        designationRole,
        isAdmin,
      });
      return await user.save();
    },
    // Create AlumProfile
    createAlumProfile: async (
      _,
      {
        firstName,
        lastName,
        bio,
        public,
        websiteLinks,
        exhibitions,
        socialMedia,
        exhibitionsReferences,
        userId,
      }
    ) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }

        const newAlumProfile = new AlumProfile({
          firstName,
          lastName,
          bio,
          public,
          websiteLinks,
          exhibitions,
          socialMedia,
          exhibitionsReferences,
          user: userId,
        });

        await newAlumProfile.save();
        return newAlumProfile;
      } catch (error) {
        throw new Error(`Error creating AlumProfile: ${error.message}`);
      }
    },
    // Create School
    createSchool: async (_, { name, url, logo, country }) => {
      const school = new School({ name, url, logo, country });
      return await school.save();
    },
    // Create Exhibition
    createExhibition: async (
      _,
      { name, location, country, poster, startDate, endDate, alumniExhibition }
    ) => {
      try {
        const newExhibition = new Exhibition({
          name,
          location,
          country,
          poster,
          startDate,
          endDate,
          alumniExhibition,
        });

        await newExhibition.save();
        return newExhibition;
      } catch (error) {
        throw new Error(`Error creating Exhibition: ${error.message}`);
      }
    },
    // Create SocialMediaLink
    createSocialMediaLink: async (_, { socialMediaPlatformId, urlLink }) => {
      try {
        const socialMediaPlatform = await SocialMediaPlatform.findById(
          socialMediaPlatformId
        );
        if (!socialMediaPlatform) {
          throw new Error("SocialMediaPlatform not found");
        }

        const newSocialMediaLink = new SocialMediaLink({
          socialMediaPlatform: socialMediaPlatformId,
          urlLink,
        });

        await newSocialMediaLink.save();
        return newSocialMediaLink;
      } catch (error) {
        throw new Error(`Error creating SocialMediaLink: ${error.message}`);
      }
    },
    // Create ExhibitionReference
    createExhibitionReference: async (
      _,
      { exhibitionId, alumProfileId, referenceLink }
    ) => {
      try {
        const exhibition = await Exhibition.findById(exhibitionId);
        const alumProfile = await AlumProfile.findById(alumProfileId);

        if (!exhibition) {
          throw new Error("Exhibition not found");
        }
        if (!alumProfile) {
          throw new Error("AlumProfile not found");
        }

        const newExhibitionReference = new ExhibitionReference({
          exhibition: exhibitionId,
          alumProfile: alumProfileId,
          referenceLink,
        });

        await newExhibitionReference.save();
        return newExhibitionReference;
      } catch (error) {
        throw new Error(`Error creating ExhibitionReference: ${error.message}`);
      }
    },

    // ------ update ********
    updateUser: async (
      _,
      { id, email, schoolId, years, register, designationRole, isAdmin }
    ) => {
      try {
        // Find the user by id
        const user = await User.findById(id);

        if (!user) {
          throw new Error("User not found");
        }

        // Update the user's fields if they are provided
        user.email = email;
        user.school = schoolId;
        user.years = years;
        user.register = register;
        user.designationRole = designationRole;
        user.isAdmin = isAdmin;

        // Save the updated user
        await user.save();

        return user;
      } catch (error) {
        throw new Error("Failed to update user: " + error.message);
      }
    },
    // Update AlumProfile
    updateAlumProfile: async (
      _,
      {
        id,
        firstName,
        lastName,
        bio,
        public,
        websiteLinks,
        exhibitions,
        socialMedia,
        exhibitionsReferences,
      }
    ) => {
      try {
        const alumProfile = await AlumProfile.findById(id);
        if (!alumProfile) {
          throw new Error("AlumProfile not found");
        }

        // Replace website links entirely
        if (websiteLinks) {
          alumProfile.websiteLinks = websiteLinks;
        }

        // Replace exhibitions if provided
        if (exhibitions) {
          alumProfile.exhibitions = exhibitions;
        }

        // Replace social media if provided
        if (socialMedia) {
          alumProfile.socialMedia = socialMedia;
        }

        // Update or add new exhibition references
        if (exhibitionsReferences) {
          exhibitionsReferences.forEach((ref) => {
            if (ref.id) {
              // Update existing reference
              const existingRefIndex = alumProfile.exhibitionsReferences.findIndex(
                (er) => er._id.toString() === ref.id
              );
              if (existingRefIndex > -1) {
                alumProfile.exhibitionsReferences[existingRefIndex] = {
                  ...alumProfile.exhibitionsReferences[existingRefIndex],
                  ...ref,
                };
              }
            } else {
              // Create new reference
              alumProfile.exhibitionsReferences.push(ref);
            }
          });
        }

        // Update other fields if provided
        if (firstName) alumProfile.firstName = firstName;
        if (lastName) alumProfile.lastName = lastName;
        if (bio) alumProfile.bio = bio;
        if (public !== undefined) alumProfile.public = public;

        await alumProfile.save();
        return alumProfile;
      } catch (error) {
        throw new Error(`Error updating AlumProfile: ${error.message}`);
      }
    },
  },

  // Additional async model requests
  // User: {
  //   school: async (user) => {
  //     return await School.findById(user.school);
  //   },
  // },

  // Alumni: {
  //   studentExhibitions: async (alumni) => {
  //     return await Promise.all(
  //       alumni.studentExhibitions.map(async (exhibitionRef) => {
  //         const exhibition = await StudentExhibition.findById(exhibitionRef.exhibition);
  //         return {
  //           exhibition,
  //           references: exhibitionRef.references,
  //         };
  //       })
  //     );
  //   },
  //   socialMedia: async (alumni) => {
  //     return await Promise.all(
  //       alumni.socialMedia.map(async (smRef) => {
  //         const socialMedia = await SocialMedia.findById(smRef.platform);
  //         return {
  //           platform: socialMedia.platform,
  //           logo: socialMedia.logo,
  //           url: smRef.url,
  //         };
  //       })
  //     );
  //   },
  //   user: async (alumni) => {
  //     const user = await User.findById(alumni.user);
  //     return user;
  //   },
  // },
};

module.exports = resolvers;
