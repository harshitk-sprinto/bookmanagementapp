import { DataTypes, Model } from "sequelize"
import { sequelize } from "../db/sequelize.js"
import { AuthorMeta } from "./mongo/metadata.js"

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

Author.addHook("afterCreate", async (createdAuthor, options) => {
    try {
        await AuthorMeta.create({
            authorId: createdAuthor.id,
            averageRating: 0,
            reviews: []
        })
    } catch (error) {
        console.error("Failed to create AuthorMeta for authorId", createdAuthor.id, error)
    }
})

export default Author;