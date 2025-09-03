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
    authorId: Int
    publishedFrom: Date
    publishedTo: Date
  }

  input AuthorFilter {
    name: String
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
    author: Author
  }

  type Query {
    books(page: Int = 1, pageSize: Int = 10, filter: BookFilter): BookConnection!
    authors(page: Int = 1, pageSize: Int = 10, filter: AuthorFilter): AuthorConnection!
    book(id: ID): Book
    author(id: ID): Author
  }

  type Mutation {
  addBook(title: String, author: String): Book
  addAuthor(name: String, biography: String): Author
}
`;
