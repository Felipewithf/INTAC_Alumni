const typeDefs = `
type User {
    id: ID!
    email: String!
    school: School!
    years: [Int!]!
    register: Boolean!
    designationRole: String
    websiteRole: String
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
  

  type Query {
    users: [User!]!
    user(id: ID!): User
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
    createUser(email: String!, schoolId: ID!, years: [Int!]!, register: Boolean!, designationRole: String, websiteRole: String): User!
    createAlumni(firstName: String!, lastName: String!, bio: String!, public: Boolean!, websiteLinks: [WebsiteLinkInput], studentExhibitions: [StudentExhibitionRefInput], socialMedia: [SocialMediaRefInput], user: ID!): Alumni!
    createSchool(name: String!, url: String!, logo: String!, country: String!): School!
    createSocialMedia(platform: String!, logo: String!): SocialMedia!
    createStudentExhibition(name: String!, location: String!, country: String!, poster: String, startDate: String!, endDate: String!): StudentExhibition!
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
