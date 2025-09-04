# BookManagementApp

A Node.js GraphQL service for managing books and authors. It uses PostgreSQL (via Sequelize) for core entities and MongoDB (via Mongoose) for metadata.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- MongoDB database

## Quick Start

1. Clone the repo and install dependencies
```bash
git clone https://github.com/harshitk-sprinto/bookmanagementapp.git
cd BookManagementApp
npm install
```

2. Create a `.env` file in the project root
Populate it with your values (see Environment Variables below).

3. Start the server
- Development (auto-restart):
```bash
npm run dev
```
- Production:
```bash
npm start
```

4. Verify the server
- Health: open `http://localhost:4000/` → "Server is running. Use /api/graphql for GraphQL queries."
- GraphQL endpoint: `http://localhost:4000/api/graphql`

## Environment Variables
The app loads configuration from `.env` using `dotenv`.

Required for PostgreSQL (Sequelize):
- `PGHOST` — PostgreSQL host
- `PGDATABASE` — database name
- `PGUSER` — database user
- `PGPASSWORD` — database password
- `NODE_ENV` — set to `production` only if you require SSL (common on managed DBs)

Required for MongoDB (Mongoose):
- `MONGO_URI` — MongoDB connection string (e.g., `mongodb://localhost:27017/bookmanagementapp`)

Optional:
- `PORT` — server port (default: `4000`)

Example `.env`:
```
# PostgreSQL
PGHOST=localhost
PGDATABASE=bookdb
PGUSER=postgres
PGPASSWORD=postgres

# MongoDB
MONGO_URI=mongodb://localhost:27017/bookmanagementapp
```

## Database Notes
- On startup, Sequelize authenticates and syncs models to PostgreSQL (creates tables if needed).
- Mongoose connects to MongoDB and manages metadata documents.

## Scripts
- `npm run dev` — start with nodemon (`src/index.js`)
- `npm start` — start with Node (`src/index.js`)

## API
- Base URL: `http://localhost:4000/`
- GraphQL endpoint: `http://localhost:4000/api/graphql`

### Example Queries
Fetch paginated books with optional filters:
```graphql
query Books($page: Int, $pageSize: Int, $filter: BookFilter) {
  books(page: $page, pageSize: $pageSize, filter: $filter) {
    nodes {
      id
      title
      description
      published_date
      authors { id name }
      metadata {
        averageRating
        reviews { reviewer comment rating createdAt }
      }
    }
    pageInfo { page pageSize totalPages totalCount hasNextPage hasPrevPage }
  }
}
```

Create a book and relate authors by IDs:
```graphql
mutation CreateBook($inputTitle: String!, $authorIds: [Int!]) {
  createBook(title: $inputTitle, authorIds: $authorIds) {
    id
    title
    authors { id name }
  }
}
```

List authors with pagination and filters:
```graphql
query Authors($page: Int, $pageSize: Int, $filter: AuthorFilter) {
  authors(page: $page, pageSize: $pageSize, filter: $filter) {
    nodes { id name biography born_date }
    pageInfo { page pageSize totalPages totalCount hasNextPage hasPrevPage }
  }
}
```

## Troubleshooting
- Connection errors on startup:
  - Verify `.env` values and that Postgres/Mongo services are running.
  - If using a managed Postgres that enforces SSL, set `NODE_ENV=production`.
- GraphQL not reachable:
  - Confirm the server logs show the port (`Server ready at ...`).
  - Ensure no other service is using the configured `PORT`.

## Project Structure
```
src/
  db/
    mongoose.js      # Mongo connection
    sequelize.js     # Postgres connection & model relations
  graphql/
    resolvers.js     # GraphQL resolvers
    typeDefs.js      # GraphQL schema
  models/            # Sequelize models + Mongo metadata models
  utils/
    pagination.js
  index.js           # App entrypoint
```