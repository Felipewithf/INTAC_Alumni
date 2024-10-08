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
  
  type Alumni {
    id: ID!
    firstName: String!
    lastName: String!
    bio: String!
    public: Boolean!
    websiteLinks: [WebsiteLink]
    studentExhibitions: [StudentExhibitionRef]
    socialMedia: [SocialMedia]
    user: User!
  }
  
  type WebsiteLink {
    id: ID!
    urlLink: String
    description: String
  }
  
  type StudentExhibitionRef {
    id: ID!
    exhibition: StudentExhibition!
    references: [String]
  }
  
  type School {
    id: ID!
    name: String!
    url: String!
    logo: String!
    country: String!
  }
  
  type SocialMedia {
    id: ID!
    platform: String
    logo: String
    url: String
  }
  
  type StudentExhibition {
    id: ID!
    name: String!
    location: String!
    country: String!
    poster: String
    startDate: String!
    endDate: String!
  }

  type Auth {
    token: ID!
    user: User!
  }
  

  type Query {
    users: [User!]!
    user(id: ID!): User
    getLoggedInUser: User
    alumni: [Alumni!]!
    alumnus(id: ID!): Alumni
    schools: [School!]!
    school(id: ID!): School
    socialMedias: [SocialMedia!]!
    studentExhibitions: [StudentExhibition!]!
    studentExhibition(id: ID!): StudentExhibition
  }
  
  # Mutations
  type Mutation {
    # Mutation for sending a magic link to the email
  sendMagicLink(email: String!): String!
  # Mutation for verifying the magic link and logging in the user
  verifyMagicLink(token: String!): Auth

    createUser(email: String!, schoolId: ID!, years: [Int], register: Boolean!, designationRole: String, isAdmin: Boolean!): User!
    createAlumni(firstName: String!, lastName: String!, bio: String!, public: Boolean!, websiteLinks: [WebsiteLinkInput], studentExhibitions: [StudentExhibitionRefInput], socialMedia: [SocialMediaRefInput], user: ID!): Alumni!
    createSchool(name: String!, url: String!, logo: String!, country: String!): School!
    createSocialMedia(platform: String!, logo: String!): SocialMedia!
    createStudentExhibition(name: String!, location: String!, country: String!, poster: String, startDate: String!, endDate: String!): StudentExhibition!

    updateUser(id: ID!, email: String, schoolId: ID, years: [Int], register: Boolean, designationRole: String, isAdmin: Boolean): User!
  }
  
  input WebsiteLinkInput {
    urlLink: String
    description: String
  }
  
  input StudentExhibitionRefInput {
    exhibitionId: ID
    references: [String]
  }

  input SocialMediaRefInput {
    platformId: ID
    url: String
  }

`;

module.exports = typeDefs;
