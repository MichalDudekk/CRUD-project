// models/CreditCardDetail.ts
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

class CreditCardDetail extends Model<
    InferAttributes<CreditCardDetail>,
    InferCreationAttributes<CreditCardDetail>
> {
    declare CreditCardID: CreationOptional<number>;
    declare UserID: ForeignKey<User["UserID"]>;
    declare LastFourDigits: string;
    declare Token: string;
    declare FirstName: string;
    declare LastName: string;
    declare CardBrand: string;
    declare ExpiryMonth: number;
    declare ExpiryYear: number;

    // pole relacji dla TypeScripta
    declare user?: NonAttribute<User>;
}

CreditCardDetail.init(
    {
        CreditCardID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        LastFourDigits: {
            type: DataTypes.STRING(4),
            allowNull: false,
        },
        Token: {
            type: DataTypes.STRING,
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
        CardBrand: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ExpiryMonth: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 12 },
        },
        ExpiryYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: "CreditCardDetails",
    }
);

export default CreditCardDetail;
