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

import type Category from "./Category.js";
import type Review from "./Review.js";
import type OrderDetail from "./OrderDetail.js";

class Product extends Model<
    InferAttributes<Product>,
    InferCreationAttributes<Product>
> {
    declare ProductID: CreationOptional<number>;
    declare CategoryID: ForeignKey<Category["CategoryID"]>;

    declare UnitPrice: number;
    declare Description: string;
    declare Functionality: string;
    declare PhotoPath: string;
    declare UnitsInStock: number;
    declare Discontinued: boolean;

    declare category?: NonAttribute<Category>;
    declare reviews?: NonAttribute<Review[]>;
    declare orderDetails?: NonAttribute<OrderDetail[]>;
}

Product.init(
    {
        ProductID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        CategoryID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        UnitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        Description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Functionality: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        PhotoPath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        UnitsInStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        Discontinued: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize: database,
        tableName: "Products",
    }
);

export default Product;
