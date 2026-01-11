// models/ShippingDetail.ts
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

class ShippingDetail extends Model<
    InferAttributes<ShippingDetail>,
    InferCreationAttributes<ShippingDetail>
> {
    declare ShippingDetailID: CreationOptional<number>;
    declare UserID: ForeignKey<User["UserID"]>;
    declare Country: string;
    declare City: string;
    declare Street: string;
    declare PostalCode: string;
    declare Phone: string;
    declare FirstName: string;
    declare LastName: string;

    declare user?: NonAttribute<User>;
}

ShippingDetail.init(
    {
        ShippingDetailID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        City: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        PostalCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        Phone: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: "ShippingDetails",
    }
);

export default ShippingDetail;
