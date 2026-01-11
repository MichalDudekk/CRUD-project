import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    type NonAttribute,
} from "sequelize";
import database from "../database.js";
import type Product from "./Product.js";

class Category extends Model<
    InferAttributes<Category>,
    InferCreationAttributes<Category>
> {
    declare CategoryID: CreationOptional<number>;
    declare CategoryName: string;
    declare Description: string;

    declare products?: NonAttribute<Product[]>;
}

Category.init(
    {
        CategoryID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        CategoryName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: "Categories",
    }
);

export default Category;
