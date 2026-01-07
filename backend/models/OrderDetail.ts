import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type ForeignKey,
    type NonAttribute,
} from "sequelize";
import database from "../database.js";

import type Order from "./Order.js";
import type Product from "./Product.js";

class OrderDetail extends Model<
    InferAttributes<OrderDetail>,
    InferCreationAttributes<OrderDetail>
> {
    // klucze obce są tu też kluczami głównymi
    declare OrderID: ForeignKey<Order["OrderID"]>;
    declare ProductID: ForeignKey<Product["ProductID"]>;

    declare Discount: number;
    declare Quantity: number;
    declare UnitPrice: number; // cena w momencie zakupu może być inna niż w Products

    declare order?: NonAttribute<Order>;
    declare product?: NonAttribute<Product>;
}

OrderDetail.init(
    {
        OrderID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        ProductID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        Discount: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0.0, max: 1.0, isDecimal: true },
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 },
        },
        UnitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: "OrderDetails",
    }
);

export default OrderDetail;
