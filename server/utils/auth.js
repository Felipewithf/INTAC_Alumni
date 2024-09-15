const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  signToken: function ({ email, _id, alumni_id, isAdmin }) {
    const payload = { email, _id, alumni_id, isAdmin };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
