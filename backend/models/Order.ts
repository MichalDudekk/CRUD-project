// models/Order.ts
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

class Order extends Model<
    InferAttributes<Order>,
    InferCreationAttributes<Order>
> {
    declare OrderID: CreationOptional<number>;
    declare UserID: ForeignKey<User["UserID"]>;
    declare OrderDate: Date;
    declare Status: string;

    declare user?: NonAttribute<User>;
}

Order.init(
    {
        OrderID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        OrderDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: "orders",
    }
);

export default Order;
