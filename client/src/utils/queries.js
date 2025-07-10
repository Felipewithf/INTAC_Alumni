import { gql } from "@apollo/client";

// Fetch all users
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      email
      school {
        name
        id
      }
      years
      register
      designationRole
      isAdmin
    }
  }
`;

// Fetch all whitelist email addresses
export const GET_WHITELIST = gql`
  query GetWhitelist {
    getUsers {
      email
    }
  }
`;

// Fetch the verified user
export const GET_LOGGED_IN_USER = gql`
  query GetLoggedInUser {
    getLoggedInUser {
      id
      email
      isAdmin
      register
    }
  }
`;

// Fetch a single user by ID
export const GET_USER_BY_ID = gql`
  query GetUserById($getUserByIdId: ID!) {
    getUserById(id: $getUserByIdId) {
      id
      email
      school {
        name
        id
      }
      years
      register
      designationRole
      isAdmin
    }
  }
`;

// Fetch all alumProfiles
export const GET_ALUMPROFILES = gql`
  query GetAlumProfiles {
    getAlumProfiles {
      firstName
      lastName
      bio
      public
      id
      user {
        email
        school {
          name
          acronym
          logo
          color
        }
        years
        designationRole
        id
      }
      socialMedia {
        id
        urlLink
        socialMediaPlatform {
          name
          logo
        }
      }
      websiteLinks {
        urlLink
        description
      }
      exhibitions {
        name
        country
        location
        poster
        id
        alumniExhibition
      }
      exhibitionsReferences {
        referenceLink
        id
        exhibition {
          id
        }
      }
    }
  }
`;

// Fetch a single alumProfile by ID
export const GET_ALUMPROFILE_BY_ID = gql`
  query GetAlumProfileById($getAlumProfileByIdId: ID!) {
    getAlumProfileById(id: $getAlumProfileByIdId) {
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
        poster
      }
      socialMedia {
        socialMediaPlatform {
          name
          logo
        }
        urlLink
        id
      }
      exhibitionsReferences {
        exhibition {
          id
        }
        id
        referenceLink
      }
      user {
        id
      }
    }
  }
`;

// Fetch a single alumProfile by USERID
export const GET_ALUMPROFILE_BY_USER_ID = gql`
  query GetAlumProfileByUserId($getAlumProfileByUserIdId: ID!) {
    getAlumProfileByUserId(id: $getAlumProfileByUserIdId) {
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
        poster
        id
        alumniExhibition
        location
        country
      }
      socialMedia {
        id
        urlLink
        socialMediaPlatform {
          name
          logo
        }
      }
      user {
        id
        email
      }
      exhibitionsReferences {
        id
        exhibition {
          id
        }
        referenceLink
      }
    }
  }
`;

// Fetch all schools
export const GET_SCHOOLS = gql`
  query GetSchools {
    getSchools {
      id
      name
      acronym
      url
      logo
      country
      location
      status
      color
    }
  }
`;

// Fetch a single school by ID
export const GET_SCHOOL = gql`
  query GetSchoolById($getSchoolByIdId: ID!) {
    getSchoolById(id: $getSchoolByIdId) {
      id
      name
      acronym
      url
      logo
      country
      location
      status
      color
    }
  }
`;

// Fetch all social media platforms
export const GET_SOCIAL_MEDIA_PLATFORMS = gql`
  query GetSocialMediaPlatforms {
    getSocialMediaPlatforms {
      id
      name
      logo
    }
  }
`;

// Fetch singel social media platform by ID
export const GET_SOCIAL_MEDIA_PLATFORM_BY_ID = gql`
  query GetSocialMediaPlatformById($getSocialMediaPlatformByIdId: ID!) {
    getSocialMediaPlatformById(id: $getSocialMediaPlatformByIdId) {
      id
      name
      logo
    }
  }
`;

// Fetch all exhibitions
export const GET_EXHIBITIONS = gql`
  query GetExhibitions {
    getExhibitions {
      id
      name
      location
      country
      poster
      startDate
      endDate
      alumniExhibition
    }
  }
`;

// Fetch a single exhibition by ID
export const GET_EXHIBITION_BY_ID = gql`
  query GetExhibitionById($getExhibitionByIdId: ID!) {
    getExhibitionById(id: $getExhibitionByIdId) {
      id
      name
      location
      country
      poster
      startDate
      endDate
      alumniExhibition
    }
  }
`;

// Fetch all social media Links
export const GET_SOCIAL_MEDIA_LINKS = gql`
  query GetSocialMediaLinks {
    getSocialMediaLinks {
      id
      urlLink
      socialMediaPlatform {
        name
        id
        logo
      }
    }
  }
`;

// Fetch single social media Link by ID
export const GET_SOCIAL_MEDIA_LINK_BY_ID = gql`
  query GetSocialMediaLinkById($getSocialMediaLinkByIdId: ID!) {
    getSocialMediaLinkById(id: $getSocialMediaLinkByIdId) {
      id
      socialMediaPlatform {
        name
        id
        logo
      }
      urlLink
    }
  }
`;

// Fetch all exhibitions References
export const GET_EXHIBITIONS_REFERENCES = gql`
  query GetExhibitionReferences {
    getExhibitionReferences {
      id
      referenceLink
      exhibition {
        name
        id
      }
      alumProfile {
        id
        firstName
        lastName
        public
      }
    }
  }
`;

// Fetch single exhibition Reference by ID
export const GET_EXHIBITION_REFERENCE_BY_ID = gql`
  query GetExhibitionReferenceById($getExhibitionReferenceByIdId: ID!) {
    getExhibitionReferenceById(id: $getExhibitionReferenceByIdId) {
      id
      exhibition {
        name
        id
      }
      alumProfile {
        id
        firstName
        lastName
        public
      }
      referenceLink
    }
  }
`;

// Fetch all announcements
export const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements {
    getAnnouncements {
      id
      title
      subtitle
      alumProfile {
        lastName
        id
        firstName
        user {
          id
        }
      }
      expiryDate
      isOnGoing
      ctaLink
      ctaText
      style
      isActive
    }
  }
`;

// Fetch a single announcement by ID
export const GET_ANNOUNCEMENT_BY_ID = gql`
  query GetAnnouncementById($getAnnouncementByIdId: ID!) {
    getAnnouncementById(id: $getAnnouncementByIdId) {
      id
      title
      subtitle
      alumProfile {
        firstName
        id
        lastName
      }
      expiryDate
      isOnGoing
      ctaLink
      ctaText
      style
      isActive
    }
  }
`;
