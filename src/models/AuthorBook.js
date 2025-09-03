import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

class AuthorBook extends Model {}

AuthorBook.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    author_id: { type: DataTypes.INTEGER, allowNull: false },
    book_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "author_books",
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["author_id", "book_id"],
        name: "author_books_author_id_book_id_unique",
      },
    ],
  }
);

export default AuthorBook;


