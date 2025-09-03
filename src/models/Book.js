import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import { BookMeta } from "./mongo/metadata.js";

class Book extends Model {}

Book.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    published_date: { type: DataTypes.DATEONLY },
    author_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    tableName: "books",
    underscored: true,
  }
);

Book.addHook("afterCreate", async (createdBook, options) => {
  try {
    await BookMeta.create({
      bookId: createdBook.id,
      averageRating: 0,
      reviews: [],
    });
  } catch (error) {
    console.error("Failed to create BookMeta for bookId", createdBook.id, error);
  }
});

export default Book;
