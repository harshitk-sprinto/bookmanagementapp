import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: false,
});

export async function initPostgres(models) {
  const { Author, Book } = models;
  Author.hasMany(Book, { foreignKey: 'author_id', as: 'books' });
  Book.belongsTo(Author, { foreignKey: 'author_id', as: 'author' });

  await sequelize.authenticate();
  await sequelize.sync();
}