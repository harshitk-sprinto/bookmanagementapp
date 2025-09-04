import Book from "./models/Book.js";

import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { initPostgres } from "./db/sequelize.js";
import Author from "./models/Author.js";
import { initMongo } from "./db/mongoose.js";
import AuthorBook from "./models/AuthorBook.js";
import express from "express";
import http from 'http';
import cors from 'cors';
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";

await initPostgres({ Author, Book, AuthorBook });
await initMongo();

const app = express()
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/api/graphql',
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

await new Promise((resolve) =>
  httpServer.listen({ port: process.env.PORT || 4000 }, resolve),
);
console.log(`Server ready at ${process.env.PORT || 4000}`);

app.get('/', (req, res) => {
  res.send('Server is running. Use /api/graphql for GraphQL queries.');
});