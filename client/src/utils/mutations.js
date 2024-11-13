import { gql } from "@apollo/client";

export const SEND_MAGIC_LINK = gql`
  mutation SendMagicLink($email: String!) {
    sendMagicLink(email: $email)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
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

export const CREATE_ALUMPROFILE = gql`
  mutation CreateAlumProfile(
    $firstName: String!
    $lastName: String!
    $bio: String!
    $public: Boolean!
    $websiteLinks: [WebsiteLinkInput]
    $exhibitions: [ID!]
    $socialMedia: [ID!]
    $exhibitionsReferences: [CreateExhibitionReferenceInput]
    $userId: ID!
  ) {
    createAlumProfile(
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      public: $public
      websiteLinks: $websiteLinks
      exhibitions: $exhibitions
      socialMedia: $socialMedia
      exhibitionsReferences: $exhibitionsReferences
      userId: $userId
    ) {
      id
      firstName
      lastName
      bio
      public
      websiteLinks {
        urlLink
        description
      }
      exhibitions {
        name
      }
      socialMedia {
        urlLink
        id
        socialMediaPlatform {
          name
          logo
        }
      }
      exhibitionsReferences {
        referenceLink
        exhibition {
          id
          name
        }
      }
      user {
        id
        email
      }
    }
  }
`;

export const CREATE_SOCIAL_MEDIA_LINK = gql`
  mutation CreateSocialMediaLink(
    $socialMediaPlatformId: ID!
    $urlLink: String!
    $alumProfileId: ID!
  ) {
    createSocialMediaLink(
      socialMediaPlatformId: $socialMediaPlatformId
      urlLink: $urlLink
      alumProfileId: $alumProfileId
    ) {
      id
      socialMediaPlatform {
        name
        logo
      }
      urlLink
    }
  }
`;

export const CREATE_EXHIBITION_REFERENCE_LINK = gql`
  mutation CreateExhibitionReference(
    $exhibitionId: ID!
    $alumProfileId: ID!
    $referenceLink: String
  ) {
    createExhibitionReference(
      exhibitionId: $exhibitionId
      alumProfileId: $alumProfileId
      referenceLink: $referenceLink
    ) {
      id
      exhibition {
        id
        name
      }
      referenceLink
      alumProfile {
        id
        public
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $updateUserId: ID!
    $register: Boolean
    $isAdmin: Boolean
    $email: String
    $schoolId: ID
    $years: [Int]
    $designationRole: String
  ) {
    updateUser(
      id: $updateUserId
      register: $register
      isAdmin: $isAdmin
      email: $email
      schoolId: $schoolId
      years: $years
      designationRole: $designationRole
    ) {
      id
      email
      years
      register
      designationRole
      isAdmin
      school {
        name
      }
    }
  }
`;

export const UPDATE_ALUMPROFILE = gql`
  mutation UpdateAlumProfile(
    $updateAlumProfileId: ID!
    $firstName: String
    $lastName: String
    $bio: String
    $public: Boolean
    $websiteLinks: [WebsiteLinkInput]
    $exhibitions: [ID!]
    $socialMedia: [ID!]
    $exhibitionsReferences: [ID!]
  ) {
    updateAlumProfile(
      id: $updateAlumProfileId
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      public: $public
      websiteLinks: $websiteLinks
      exhibitions: $exhibitions
      socialMedia: $socialMedia
      exhibitionsReferences: $exhibitionsReferences
    ) {
      exhibitionsReferences {
        id
        referenceLink
      }
      id
      firstName
      lastName
      bio
      public
      websiteLinks {
        urlLink
        description
      }
      exhibitions {
        id
        name
      }
      socialMedia {
        id
        urlLink
      }
      user {
        id
      }
    }
  }
`;
