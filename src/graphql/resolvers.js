import { GraphQLScalarType } from "graphql";
import Author from "../models/Author.js";
import Book from "../models/Book.js";
import { toConnection, toPageArgs } from "../utils/pagination.js";

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
        addBook: async function(_, {title, author}) {return await Book.create({title})},
        addAuthor: async function(_, {name, biography}) {return await Author.create({name, biography})}
    }
}