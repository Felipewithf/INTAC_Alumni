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
mutation UpdateUser($updateUserId: ID!, $email: String, $schoolId: ID, $years: [Int], $register: Boolean, $designationRole: String, $isAdmin: Boolean) {
    updateUser(id: $updateUserId, email: $email, schoolId: $schoolId, years: $years, register: $register, designationRole: $designationRole, isAdmin: $isAdmin) {
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