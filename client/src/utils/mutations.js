import { gql } from '@apollo/client';

export const SEND_MAGIC_LINK = gql`
  mutation SendMagicLink($email: String!) {
    sendMagicLink(email: $email)
  }
`;