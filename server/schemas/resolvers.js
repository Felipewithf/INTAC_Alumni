const {
  User,
  Alumni,
  School,
  SocialMedia,
  StudentExhibition,
} = require("../models");

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().populate("school");
    },
    user: async (_, { id }) => {
      return await User.findById(id).populate("school");
    },
    alumni: async () => {
      return await Alumni.find()
        .populate({
          path: "studentExhibitions.exhibition",
          model: "StudentExhibition",
        })
        .populate("socialMedia");
    },
    alumnus: async (_, { id }) => {
      return await Alumni.findById(id)
        .populate({
          path: "studentExhibitions.exhibition",
          model: "StudentExhibition",
        })
        .populate("socialMedia");
    },
    schools: async () => {
      return await School.find();
    },
    school: async (_, { id }) => {
      return await School.findById(id);
    },
    socialMedias: async () => {
      return await SocialMedia.find();
    },
    studentExhibitions: async () => {
      return await StudentExhibition.find();
    },
    studentExhibition: async (_, { id }) => {
      return await StudentExhibition.findById(id);
    },
  },

  Mutation: {
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
    createAlumni: async (
      _,
      {
        firstName,
        lastName,
        bio,
        public,
        websiteLinks,
        studentExhibitions,
        socialMedia,
        user,
      }
    ) => {
      const exhibitionRefs = await Promise.all(
        studentExhibitions.map(async (exhibitionRef) => {
          const exhibition = await StudentExhibition.findById(
            exhibitionRef.exhibitionId
          );
          return {
            exhibition: exhibition._id,
            references: exhibitionRef.references,
          };
        })
      );

      const socialMediaRefs = await Promise.all(
        socialMedia.map(async (sm) => {
          const platform = await SocialMedia.findById(sm.platformId);
          return {
            platform: platform._id,
            url: sm.url,
          };
        })
      );

      const alumni = new Alumni({
        firstName,
        lastName,
        bio,
        public,
        websiteLinks,
        studentExhibitions: exhibitionRefs,
        socialMedia: socialMediaRefs,
        user,
      });
      return await alumni.save();
    },
    createSchool: async (_, { name, url, logo, country }) => {
      const school = new School({ name, url, logo, country });
      return await school.save();
    },
    createSocialMedia: async (_, { platform, logo }) => {
      const socialMedia = new SocialMedia({ platform, logo });
      return await socialMedia.save();
    },
    createStudentExhibition: async (
      _,
      { name, location, country, poster, startDate, endDate }
    ) => {
      const exhibition = new StudentExhibition({
        name,
        location,
        country,
        poster,
        startDate,
        endDate,
      });
      return await exhibition.save();
    },
  },

  User: {
    school: async (user) => {
      return await School.findById(user.school);
    },
  },

  Alumni: {
    studentExhibitions: async (alumni) => {
      return await Promise.all(
        alumni.studentExhibitions.map(async (exhibitionRef) => {
          const exhibition = await StudentExhibition.findById(
            exhibitionRef.exhibition
          );
          return {
            exhibition,
            references: exhibitionRef.references,
          };
        })
      );
    },
    socialMedia: async (alumni) => {
      return await Promise.all(
        alumni.socialMedia.map(async (smRef) => {
          const socialMedia = await SocialMedia.findById(smRef.platform);
          return {
            platform: socialMedia.platform,
            logo: socialMedia.logo,
            url: smRef.url,
          };
        })
      );
    },
    user: async (alumni) => {
      const user = await User.findById(alumni.user);
      return user;
    },
  },
};

module.exports = resolvers;
