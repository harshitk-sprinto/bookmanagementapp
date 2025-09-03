import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: false,
});

export async function initPostgres(models) {
  const { Author, Book, AuthorBook } = models;
  Author.belongsToMany(Book, {
    through: AuthorBook,
    foreignKey: 'author_id',
    otherKey: 'book_id',
    as: 'books'
  });
  Book.belongsToMany(Author, {
    through: AuthorBook,
    foreignKey: 'book_id',
    otherKey: 'author_id',
    as: 'authors'
  });

  await sequelize.authenticate();
  await sequelize.sync();
}