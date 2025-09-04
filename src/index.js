import Book from "./models/Book.js";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
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
console.log(`🚀 Server ready at ${process.env.PORT || 4000}`);

app.get('/', (req, res) => {
  res.send('Server is running. Use /api/graphql for GraphQL queries.');
});


// await sequelize.sync({ force: true });
// console.log('All models were synchronized successfully.');

// Book.sync()
// const alchemist = await Book.create({title: "Power of Now", description: "A spiritual enlightenment Guide", published_date: new Date()})
// console.log(alchemist instanceof Book); // true
// console.log(alchemist.title);
// console.log(alchemist.description);

// Author.sync()
// const hg = await Author.create({name: "J.K. Rowling", biography: "Creator of Harry Potter series books"})
// console.log(hg instanceof Author); // true
// console.log(hg.name);


// Find all users
// const books = await Book.findAll();
// console.log(books.every(book => book instanceof Book)); // true
// console.log('All books:', JSON.stringify(books, null, 2));