import { GraphQLScalarType, Kind } from "graphql";
import Author from "../models/Author.js";
import Book from "../models/Book.js";
import { toConnection, toPageArgs } from "../utils/pagination.js";
import { Op } from "sequelize";

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue: (value) => value ? new Date(value) : null,
    serialize: (value) => value ? new Date(value).toISOString() : null,
    parseLiteral: (ast) => (ast.kind === Kind.STRING ? new Date(ast.value) : null)
    });

export const resolvers = {
    Date: dateScalar,
    Query: {
        book: async function(_, {id}) {return await Book.findByPk(id)},
        books: async function(_, {page, pageSize, filter = {}}) {
            const { limit, offset } = toPageArgs({ page, pageSize });
            const where = {};
            if (filter.title) where.title = { [Op.iLike]: `%${filter.title}%` };
            if (filter.publishedFrom || filter.publishedTo) {
            where.published_date = {};
            if (filter.publishedFrom) where.published_date[Op.gte] = filter.publishedFrom;
            if (filter.publishedTo) where.published_date[Op.lte] = filter.publishedTo;
            }

            const include = [];
            if (filter.authorIds && filter.authorIds.length > 0) {
                include.push({
                    model: Author,
                    as: 'authors',
                    through: { attributes: [] },
                    where: { id: { [Op.in]: filter.authorIds } }
                });
            } else {
                include.push({ model: Author, as: 'authors', through: { attributes: [] } });
            }

            const { rows, count } = await Book.findAndCountAll({ where, limit, offset, include });

            return toConnection({ rows, count, page, pageSize });
        },
        authors: async function(_, {page, pageSize, filter = {}}) {
            const { limit, offset } = toPageArgs({ page, pageSize });
            const where = {};
            if (filter.name) where.name = { [Op.iLike]: `%${filter.name}%` };
            if (filter.bornYear) {
            where.born_date = {};
            if (filter.bornYear) {
                const y = filter.bornYear;
                where.born_date[Op.gte] = new Date(Date.UTC(y, 0, 1));
                where.born_date[Op.lte] = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
            }
            }
            
            const { rows, count } = await Author.findAndCountAll({ where, limit, offset });
            
            
            return toConnection({ rows, count, page, pageSize });
            },
        author: async function(_, {id}) {return await Author.findByPk(id)},
    },
    Mutation: {
        createBook: async function(_, args) {
            const { title, description, published_date, authorIds } = args;
            const book = await Book.create({ title, description, published_date });
            if (authorIds && authorIds.length > 0) {
                await book.setAuthors(authorIds);
            }
            return await Book.findByPk(book.id, { include: [{ model: Author, as: 'authors', through: { attributes: [] } }] });
        },
        updateBook: async function(_, args) {
            const { id, title, description, published_date, authorIds } = args;
            const book = await Book.findByPk(id);
            if (!book) throw new Error("Book not found");
            await book.update({ title, description, published_date });
            if (authorIds) {
                await book.setAuthors(authorIds);
            }
            return await Book.findByPk(book.id, { include: [{ model: Author, as: 'authors', through: { attributes: [] } }] });
        },
        deleteBook: async function(_, { id }) {
            const book = await Book.findByPk(id);
            if (!book) return false;
            await book.destroy();
            return true;
        },
        createAuthor: async function(_, args) {
            const { name, biography, born_date } = args;
            const author = await Author.create({ name, biography, born_date });
            return author;
        },
        updateAuthor: async function(_, args) {
            const { id, name, biography, born_date } = args;
            const author = await Author.findByPk(id);
            if (!author) throw new Error("Author not found");
            await author.update({ name, biography, born_date });
            return author;
        },
        deleteAuthor: async function(_, { id }) {
            const author = await Author.findByPk(id);
            if (!author) return false;
            await author.destroy();
            return true;
        },

    },
    Author: {
        books: async (author) => {
            const instance = await Author.findByPk(author.id);
            return await instance.getBooks();
        }
    },
    Book: {
        authors: async (book) => {
            const instance = await Book.findByPk(book.id);
            return await instance.getAuthors();
        }
    }
}