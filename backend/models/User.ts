// models/User.ts
import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    type NonAttribute,
} from "sequelize";
import database from "../database.js";

import type ShippingDetail from "./ShippingDetail.js";
import type CreditCardDetail from "./CreditCardDetail.js";
import type Order from "./Order.js";
import type Review from "./Review.js";

// oficjalne zalecenia z dokumentacji Sequelize dla TypeScript
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare UserID: CreationOptional<number>; // pole id nie jest wymagane podczas tworzenia Użytkownika
    declare Email: string;
    declare Password: string;
    declare IsAdmin: boolean;
    declare Session: string;

    declare shippingDetails?: NonAttribute<ShippingDetail[]>;
    declare creditCardDetails?: NonAttribute<CreditCardDetail[]>;
    declare orders?: NonAttribute<Order[]>;
    declare reviews?: NonAttribute<Review[]>;
}

User.init(
    {
        UserID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Password: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        IsAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        Session: {
            type: DataTypes.STRING(128),
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize: database,
        tableName: "Users",
    }
);

export default User;
