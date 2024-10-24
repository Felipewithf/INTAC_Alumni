import { gql } from "@apollo/client";

// Fetch all users
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      school {
        id
        name
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
    users {
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
    }
  }
`;

// Fetch a single user by ID
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      school {
        id
        name
      }
      years
      register
      designationRole
      isAdmin
    }
  }
`;

// Fetch all alumni
export const GET_ALUMNI = gql`
  query GetAlumni {
    alumni {
      firstName
      lastName
      bio
      public
      id
      websiteLinks {
        description
        urlLink
      }
      studentExhibitions {
        exhibition {
          name
          poster
        }
        references
      }
      socialMedia {
        platform
        url
        logo
      }
      user {
        school {
          name
          logo
        }
        years
        designationRole
        id
      }
    }
  }
`;

// Fetch a single alumnus by ID
export const GET_ALUMNUS = gql`
  query GetAlumnus($id: ID!) {
    alumnus(id: $id) {
      id
      firstName
      bio
      public
      lastName
      id
      websiteLinks {
        description
        urlLink
      }
      studentExhibitions {
        exhibition {
          name
        }
        references
      }
      socialMedia {
        platform
        url
        logo
      }
      user {
        email
        school {
          name
          logo
        }
        years
        designationRole
        register
      }
    }
  }
`;

// Fetch all schools
export const GET_SCHOOLS = gql`
  query GetSchools {
    schools {
      id
      name
      url
      logo
      country
    }
  }
`;

// Fetch a single school by ID
export const GET_SCHOOL = gql`
  query GetSchool($id: ID!) {
    school(id: $id) {
      id
      name
      url
      logo
      country
    }
  }
`;

// Fetch all social media platforms
export const GET_SOCIAL_MEDIAS = gql`
  query GetSocialMedias {
    socialMedias {
      id
      platform
      logo
      url
    }
  }
`;

// Fetch all student exhibitions
export const GET_STUDENT_EXHIBITIONS = gql`
  query GetStudentExhibitions {
    studentExhibitions {
      id
      name
      location
      country
      poster
      startDate
      endDate
    }
  }
`;

// Fetch a single student exhibition by ID
export const GET_STUDENT_EXHIBITION = gql`
  query GetStudentExhibition($id: ID!) {
    studentExhibition(id: $id) {
      id
      name
      location
      country
      poster
      startDate
      endDate
    }
  }
`;
