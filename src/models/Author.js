import { DataTypes, Model } from "sequelize"
import { sequelize } from "../db/sequelize.js"

class Author extends Model {}

Author.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        biography: { type: DataTypes.TEXT },
        born_date: { type: DataTypes.DATEONLY }
    },
    {
        sequelize: sequelize,
        tableName: 'authors',
        underscored: true
    }
)

export default Author;