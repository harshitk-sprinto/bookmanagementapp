export const typeDefs = `#graphql
  scalar Date

  type PageInfo {
    page: Int!
    pageSize: Int!
    totalPages: Int!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
  }

  input BookFilter {
    title: String
    authorIds: [Int!]
    publishedFrom: Date
    publishedTo: Date
  }

  input AuthorFilter {
    name: String
    bornYear: Int
    bornFrom: Date
    bornTo: Date
  }

  type BookConnection {
    nodes: [Book!]!
    pageInfo: PageInfo!
  }

  type AuthorConnection {
    nodes: [Author!]!
    pageInfo: PageInfo!
  }

  type Author{
    id: Int
    name: String
    biography: String
    born_date: Date
    books: [Book]
  }

  type Book {
    id: Int
    title: String
    description: String
    published_date: Date
    authors: [Author]
  }

  type Query {
    books(page: Int = 1, pageSize: Int = 10, filter: BookFilter): BookConnection!
    authors(page: Int = 1, pageSize: Int = 10, filter: AuthorFilter): AuthorConnection!
    book(id: ID): Book
    author(id: ID): Author
  }

  type Mutation {
    createBook(
      title: String!
      description: String
      published_date: Date
      authorIds: [Int!]
    ): Book!

    updateBook(
      id: ID!
      title: String
      description: String
      published_date: Date
      authorIds: [Int!]
    ): Book!

    deleteBook(id: ID!): Boolean!

    createAuthor(
      name: String!
      biography: String
      born_date: Date
    ): Author!

    updateAuthor(
      id: ID!
      name: String
      biography: String
      born_date: Date
    ): Author!

    deleteAuthor(id: ID!): Boolean!

  }
`;
