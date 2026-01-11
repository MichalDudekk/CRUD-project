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
import type OrderDetail from "./OrderDetail.js";

class Order extends Model<
    InferAttributes<Order>,
    InferCreationAttributes<Order>
> {
    declare OrderID: CreationOptional<number>;
    declare UserID: ForeignKey<User["UserID"]>;
    declare OrderDate: Date;
    declare Status: string;
    declare TotalCost: number;

    declare user?: NonAttribute<User>;
    declare orderDetails?: NonAttribute<OrderDetail[]>;
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
        TotalCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: "Orders",
    }
);

export default Order;
