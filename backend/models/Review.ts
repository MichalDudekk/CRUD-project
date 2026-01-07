import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    type ForeignKey,
    type NonAttribute,
} from "sequelize";
import database from "../database.js";

import type User from "./User.js";
import type Product from "./Product.js";

class Review extends Model<
    InferAttributes<Review>,
    InferCreationAttributes<Review>
> {
    declare ReviewID: CreationOptional<number>;
    declare UserID: ForeignKey<User["UserID"]>;
    declare ProductID: ForeignKey<Product["ProductID"]>;

    declare Rating: number;
    declare Content: string;
    declare Status: string;

    declare user?: NonAttribute<User>;
    declare product?: NonAttribute<Product>;
}

Review.init(
    {
        ReviewID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5 },
        },
        Content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: "Reviews",
    }
);

export default Review;
