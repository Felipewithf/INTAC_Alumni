const {
  User,
  AlumProfile,
  School,
  Exhibition,
  SocialMediaLink,
  SocialMediaPlatform,
  ExhibitionReference,
} = require("../models");
const { sendMagicLinkEmail, sendEmail } = require("../utils/sendEmail");
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
      try {
        // Find the school using the provided schoolId
        const school = await School.findById(schoolId);

        // Create a new user instance with provided data
        const user = new User({
          email,
          school,
          years,
          register,
          designationRole,
          isAdmin,
        });

        // Save the user to the database
        const savedUser = await user.save();

        // After saving the user, send the invitation email
        const mailOptions = {
          from: "Intac Connect",
          to: email,
          subject: "You have been invited to join Intac Connect!",
          text: `Hello ${savedUser.email},\n\nYou have been invited to join the Intac Connect network.\n\n When you are ready to join, go to connect.intactnet.org and login using ${savedUser.email} address to get started.\n\n\nBest regards,\nIntac Connect`,
          html: `<h3>Hello ${savedUser.email},</h3><p>You have been invited to join the Intac Connect network.</p><p>When you are ready to join, go to <a href="https://connect.intacnet.org/login">connect.intacnet.org</a> and login using ${savedUser.email} address to get started.</p><p>Best regards,<br>Intac Connect</p>`,
        };

        sendEmail(mailOptions);

        console.log(`Invitation email sent to ${email}`);

        // Return the saved user
        return savedUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user or send invitation email.");
      }
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

    deleteUser: async (_, { id }) => {
      try {
        // Find the user by their ID to check if they are registered
        const user = await User.findById(id);

        // If the user does not exist, throw an error
        if (!user) {
          throw new Error("User not found");
        }

        // Check if the user is registered
        if (user.register) {
          throw new Error("User is already registered and cannot be deleted");
        }
        // If the user is not registered, delete the user
        const deletedUser = await User.findByIdAndDelete(id);

        // If the user was not deleted, throw an error
        if (!deletedUser) {
          throw new Error("Failed to delete the user");
        }

        return !!deletedUser;
      } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      }
    },

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
  },
};

module.exports = resolvers;
