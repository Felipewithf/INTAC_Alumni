const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const jwt = require("jsonwebtoken"); // Import JWT
// const { authMiddleware } = require('./utils/auth');
require("dotenv").config();

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

const context = async ({ req }) => {
  // Get the token from the Authorization header (Bearer <token>)
  const token = req.headers.authorization || "";
  if (token) {
    try {
      // Verify the JWT token and return the decoded user data
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      return { user: decoded }; // This will be accessible in your resolvers as context.user
    } catch (err) {
      console.log("Invalid token", err);
    }
  }
  return {}; // Return an empty context if no token or invalid token
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => context({ req }),
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      const email = process.env.EMAIL_USER;
      console.log(email);


      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
