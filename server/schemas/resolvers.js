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
        .populate({
          path: "user",
          populate: {
            path: "school",
            model: "School",
          },
        })
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
        })
        .sort({ "user.firstName": 1 });
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
    getAlumProfileByUserId: async (_, { id }) => {
      return await AlumProfile.findOne({ user: id })
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
        {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          register: user.register,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2m",
        }
      );

      return {
        token: authToken,
        user,
      };
    },

    // ******* ******* *******
    // ------- create -------
    // ******* ******* *******

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
    // Create School
    createSchool: async (
      _,
      { name, acronym, url, logo, country, location, status, color }
    ) => {
      const school = new School({
        name,
        acronym,
        url,
        logo,
        country,
        location,
        status,
        color,
      });
      return await school.save();
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

        user.register = true;
        await user.save();

        return newAlumProfile.populate("user");
      } catch (error) {
        throw new Error(`Error creating AlumProfile: ${error.message}`);
      }
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
    // Create Social Media Platform
    createSocialMediaPlatform: async (_, { name, logo }) => {
      const socialMediaPlatform = new SocialMediaPlatform({
        name,
        logo,
      });
      return await socialMediaPlatform.save();
    },
    // Create SocialMediaLink
    createSocialMediaLink: async (
      _,
      { socialMediaPlatformId, urlLink, alumProfileId }
    ) => {
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

        const savedLink = await newSocialMediaLink.save();

        // Find the AlumProfile by ID and add the new social media link to its socialMedia array
        const updatedAlumProfile = await AlumProfile.findByIdAndUpdate(
          alumProfileId,
          { $push: { socialMedia: savedLink._id } }, // Push the new link ID into the socialMedia array
          { new: true } // Return the updated document
        );

        if (!updatedAlumProfile) {
          throw new Error("AlumProfile not found");
        }

        // Populate the socialMediaPlatform field before returning
        return savedLink.populate("socialMediaPlatform");
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

        const savedReferenced = await newExhibitionReference.save();

        // Find the AlumProfile by ID and add the new exhibitionReference
        const updatedAlumProfile = await AlumProfile.findByIdAndUpdate(
          alumProfileId,
          { $push: { exhibitionsReferences: savedReferenced._id } }, // Push the new Reference ID into the exhibitionReference array
          { new: true } // Return the updated document
        );

        if (!updatedAlumProfile) {
          throw new Error("AlumProfile not found");
        }

        // Use findById with populate instead of calling populate directly
        const populatedExhibitionReference = await ExhibitionReference.findById(
          savedReferenced._id
        )
          .populate("exhibition")
          .populate("alumProfile");

        return populatedExhibitionReference;
      } catch (error) {
        throw new Error(`Error creating ExhibitionReference: ${error.message}`);
      }
    },

    // ******* ******* *******
    // ------- Update -------
    // ******* ******* *******
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

        // Make sure all the fields that are provided !
        user.email = email;
        user.school = schoolId;
        user.years = years;
        user.register = register;
        user.designationRole = designationRole;
        user.isAdmin = isAdmin;

        // Save the updated user
        await user.save();

        return user.populate("school");
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
        const alumProfileToUpdate = await AlumProfile.findById(id);
        if (!alumProfileToUpdate) {
          throw new Error("AlumProfile not found");
        }

        // Make sure all the fields are provided and they will overide existing ones
        alumProfileToUpdate.firstName = firstName;
        alumProfileToUpdate.lastName = lastName;
        alumProfileToUpdate.bio = bio;
        alumProfileToUpdate.public = public;

        alumProfileToUpdate.websiteLinks = websiteLinks;
        alumProfileToUpdate.exhibitions = exhibitions;
        alumProfileToUpdate.socialMedia = socialMedia;
        alumProfileToUpdate.exhibitionsReferences = exhibitionsReferences;

        // Save and populate references in the updated profile
        await alumProfileToUpdate.save();
        const alumProfileUpdated = await AlumProfile.findById(id)
          .populate("user")
          .populate("exhibitionsReferences")
          .populate("socialMedia")
          .populate("exhibitions");

        return alumProfileUpdated;
      } catch (error) {
        throw new Error(`Error updating AlumProfile: ${error.message}`);
      }
    },
    // Update SocialMediaLink
    updateSocialMediaLink: async (_, { id, urlLink }) => {
      try {
        const updatedLink = await SocialMediaLink.findByIdAndUpdate(
          id,
          {
            ...(urlLink && { urlLink }),
          },
          { new: true }
        ).populate("socialMediaPlatform");

        if (!updatedLink) {
          throw new Error("SocialMediaLink not found");
        }

        return updatedLink;
      } catch (error) {
        throw new Error(`Error updating SocialMediaLink: ${error.message}`);
      }
    },
    // Update ExhibitionReference
    updateExhibitionReference: async (_, { id, referenceLink }) => {
      try {
        const updatedReference = await ExhibitionReference.findByIdAndUpdate(
          id,
          {
            ...(referenceLink && { referenceLink }),
          },
          { new: true }
        )
          .populate("exhibition")
          .populate("alumProfile");

        if (!updatedReference) {
          throw new Error("ExhibitionReference not found");
        }

        return updatedReference;
      } catch (error) {
        throw new Error(`Error updating ExhibitionReference: ${error.message}`);
      }
    },

    // ******* ******* *******
    // ------- Delete -------
    // ******* ******* *******

    // Delete SocialMediaLink
    deleteSocialMediaLink: async (_, { id }) => {
      try {
        // Find and delete the social media link
        const deleted = await SocialMediaLink.findByIdAndDelete(id);

        if (!deleted) {
          throw new Error("SocialMediaLink not found");
        }

        // Update all AlumProfiles that contain this social media link ID
        await AlumProfile.updateMany(
          { socialMedia: id }, // Find profiles that have this social media link ID
          { $pull: { socialMedia: id } } // Remove the ID from the socialMedia array
        );

        return !!deleted;
      } catch (error) {
        throw new Error(
          `Failed to delete SocialMediaLink and update AlumProfile: ${error.message}`
        );
      }
    },

    // Delete ExhibitionReference
    deleteExhibitionReference: async (_, { id }) => {
      try {
        // Find and delete the exhibition reference
        const deleted = await ExhibitionReference.findByIdAndDelete(id);

        if (!deleted) {
          throw new Error("ExhibitionReference not found");
        }

        // Update all AlumProfiles that contain this exhibition reference ID
        await AlumProfile.updateMany(
          { exhibitionsReferences: id }, // Find profiles that have this exhibition reference ID
          { $pull: { exhibitionsReferences: id } } // Remove the ID from the exhibitionsReferences array
        );

        return !!deleted;
      } catch (error) {
        throw new Error(
          `Failed to delete ExhibitionReference and update AlumProfile: ${error.message}`
        );
      }
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
  },
};

module.exports = resolvers;
