import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize.js";

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

export default Book;
