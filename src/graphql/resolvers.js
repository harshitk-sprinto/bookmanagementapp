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
            if (filter.authorId != null) where.author_id = filter.authorId;
            if (filter.publishedFrom || filter.publishedTo) {
            where.published_date = {};
            if (filter.publishedFrom) where.published_date[Op.gte] = filter.publishedFrom;
            if (filter.publishedTo) where.published_date[Op.lte] = filter.publishedTo;
            }

            const { rows, count } = await Book.findAndCountAll({
                where,
                limit,
                offset,
                include: [{ model: Author, as: 'author' }]
            });

            return toConnection({ rows, count, page, pageSize });
        },
        authors: async function(_, {page, pageSize, filter = {}}) {
            const { limit, offset } = toPageArgs({ page, pageSize });
            const where = {};
            if (filter.name) where.name = { [Op.iLike]: `%${filter.name}%` };
            if (filter.bornFrom || filter.bornTo) {
            where.born_date = {};
            if (filter.bornFrom) where.born_date[Op.gte] = filter.bornFrom;
            if (filter.bornTo) where.born_date[Op.lte] = filter.bornTo;
            }
            
            const { rows, count } = await Author.findAndCountAll({
            where,
            limit,
            offset,
            });
            
            
            return toConnection({ rows, count, page, pageSize });
            },
        author: async function(_, {id}) {return await Author.findByPk(id)},
    },
    Mutation: {
        createBook: async function(_, args) {
            const { title, description, published_date, authorId } = args;
            const book = await Book.create({ title, description, published_date, author_id: authorId ?? null });
            return await Book.findByPk(book.id, { include: [{ model: Author, as: 'author' }] });
        },
        updateBook: async function(_, args) {
            const { id, title, description, published_date, authorId } = args;
            const book = await Book.findByPk(id);
            if (!book) throw new Error("Book not found");
            await book.update({ title, description, published_date, author_id: authorId ?? book.author_id });
            return await Book.findByPk(book.id, { include: [{ model: Author, as: 'author' }] });
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
        setBookAuthor: async function(_, { bookId, authorId }) {
            const book = await Book.findByPk(bookId);
            if (!book) throw new Error("Book not found");
            const author = await Author.findByPk(authorId);
            if (!author) throw new Error("Author not found");
            await book.update({ author_id: author.id });
            return await Book.findByPk(book.id, { include: [{ model: Author, as: 'author' }] });
        },
        removeBookAuthor: async function(_, { bookId }) {
            const book = await Book.findByPk(bookId);
            if (!book) throw new Error("Book not found");
            await book.update({ author_id: null });
            return await Book.findByPk(book.id, { include: [{ model: Author, as: 'author' }] });
        }
    },
    Author: {
        books: async (author) => {
            return await Book.findAll({ where: { author_id: author.id } });
        }
    },
    Book: {
        author: async (book) => {
            if (book.author) return book.author;
            if (!book.author_id) return null;
            return await Author.findByPk(book.author_id);
        }
    }
}