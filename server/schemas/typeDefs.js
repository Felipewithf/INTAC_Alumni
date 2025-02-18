const typeDefs = `
type User {
    id: ID!
    email: String!
    school: School!
    years: [Int]
    register: Boolean!
    designationRole: String
    isAdmin: Boolean!
  }

  type School {
    id: ID!
    name: String!
    acronym: String
    url: String!
    logo: String!
    country: String!
    location: String
    status: String
    color: String
  }
  
  type AlumProfile {
    id: ID!
    firstName: String!
    lastName: String!
    bio: String!
    public: Boolean!
    websiteLinks: [WebsiteLink]
    exhibitions: [Exhibition]
    socialMedia: [SocialMediaLink]
    exhibitionsReferences: [ExhibitionReference]
    user: User!
  }
  
   type WebsiteLink {
    urlLink: String
    description: String
  }

  type ExhibitionReference {
    id: ID!
    exhibition: Exhibition
    alumProfile: AlumProfile
    referenceLink: String!
  }
  
  
  type SocialMediaLink {
    id: ID!
    socialMediaPlatform: SocialMediaPlatform
    urlLink: String!
  }
  
  type SocialMediaPlatform {
    id: ID!
    name: String!
    logo: String
  }
  
  type Exhibition {
    id: ID!
    name: String!
    location: String!
    country: String!
    poster: String!
    startDate: String!
    endDate: String!
    alumniExhibition: Boolean!
  }

  type Auth {
    token: ID!
    user: User!
  }
  
  type Query {
    getUsers: [User!]!
    getUserById(id: ID!): User
    getLoggedInUser: User
    getSchools: [School!]!
    getSchoolById(id: ID!): School
    getAlumProfiles: [AlumProfile!]!
    getAlumProfileById(id: ID!): AlumProfile
    getAlumProfileByUserId(id: ID!): AlumProfile
    getExhibitions: [Exhibition!]!
    getExhibitionById(id: ID!): Exhibition
    getSocialMediaPlatforms: [SocialMediaPlatform!]!
    getSocialMediaPlatformById(id: ID!): SocialMediaPlatform
    getSocialMediaLinks: [SocialMediaLink!]!
    getSocialMediaLinkById(id: ID!): SocialMediaLink
    getExhibitionReferences: [ExhibitionReference!]!
    getExhibitionReferenceById(id: ID!): ExhibitionReference
  }
  
  # Mutations
  type Mutation {
    # Mutations: Auth
    # Mutation for sending a magic link to the email
    sendMagicLink(email: String!): String!
    # Mutation for verifying the magic link and logging in the user
    verifyMagicLink(token: String!): Auth

    # Mutations: Create
    createUser(email: String!, schoolId: ID!, years: [Int], register: Boolean!, designationRole: String, isAdmin: Boolean!): User!
    createSchool(name: String!, acronym: String, url: String!, logo: String!, country: String!, location: String, status: String, color: String): School!
    createAlumProfile( firstName: String!, lastName: String!, bio: String!, public: Boolean!, websiteLinks: [WebsiteLinkInput], exhibitions: [ID!], socialMedia: [ID!], exhibitionsReferences: [CreateExhibitionReferenceInput], userId: ID!): AlumProfile!
    createExhibition( name: String!, location: String!, country: String!, poster: String, startDate: String!, endDate: String!, alumniExhibition: Boolean! ): Exhibition!
    createSocialMediaPlatform( name: String!, logo: String ): SocialMediaPlatform!
    createSocialMediaLink( socialMediaPlatformId: ID!, urlLink: String!, alumProfileId: ID! ): SocialMediaLink!
    createExhibitionReference( exhibitionId: ID!, alumProfileId: ID!, referenceLink: String ): ExhibitionReference!

    # Mutations: Update
    updateUser(id: ID!, email: String, schoolId: ID, years: [Int], register: Boolean, designationRole: String, isAdmin: Boolean): User!
    updateAlumProfile( id: ID!, firstName: String, lastName: String, bio: String, public: Boolean, websiteLinks: [WebsiteLinkInput], exhibitions: [ID!], socialMedia: [ID!], exhibitionsReferences: [ID!] ): AlumProfile!
    updateSocialMediaLink(id: ID!, urlLink: String): SocialMediaLink!
    updateExhibitionReference(id: ID!, referenceLink: String): ExhibitionReference!

    # Mutations: Delete
    deleteUser(id: ID!): Boolean!
    deleteSocialMediaLink(id: ID!): Boolean!
    deleteExhibitionReference(id: ID!): Boolean!

  }

  input WebsiteLinkInput {
    urlLink: String!
    description: String!
  }

  input CreateExhibitionReferenceInput {
    exhibitionId: ID!
    referenceLink: String
  }

`;

module.exports = typeDefs;
