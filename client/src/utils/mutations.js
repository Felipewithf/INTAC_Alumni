import { gql } from "@apollo/client";

export const SEND_MAGIC_LINK = gql`
  mutation SendMagicLink($email: String!) {
    sendMagicLink(email: $email)
  }
`;

export const ADD_USER = gql`
  mutation Mutation(
    $email: String!
    $schoolId: ID!
    $register: Boolean!
    $isAdmin: Boolean!
    $years: [Int]
    $designationRole: String
  ) {
    createUser(
      email: $email
      schoolId: $schoolId
      register: $register
      isAdmin: $isAdmin
      years: $years
      designationRole: $designationRole
    ) {
      designationRole
      email
      id
      isAdmin
      register
      school {
        name
      }
      years
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $updateUserId: ID!
    $email: String
    $schoolId: ID
    $years: [Int]
    $register: Boolean
    $designationRole: String
    $isAdmin: Boolean
  ) {
    updateUser(
      id: $updateUserId
      email: $email
      schoolId: $schoolId
      years: $years
      register: $register
      designationRole: $designationRole
      isAdmin: $isAdmin
    ) {
      id
      email
      school {
        name
      }
      years
      register
      designationRole
      isAdmin
    }
  }
`;

export const CREATE_ALUM = gql`
  mutation CreateAlumni(
    $firstName: String!
    $lastName: String!
    $bio: String!
    $public: Boolean!
    $user: ID!
    $websiteLinks: [WebsiteLinkInput]
    $studentExhibitions: [StudentExhibitionRefInput]
    $socialMedia: [SocialMediaRefInput]
  ) {
    createAlumni(
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      public: $public
      user: $user
      websiteLinks: $websiteLinks
      studentExhibitions: $studentExhibitions
      socialMedia: $socialMedia
    ) {
      bio
      firstName
      id
      lastName
      public
      user {
        id
      }
    }
  }
`;