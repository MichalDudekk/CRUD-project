// model/index.ts
import User from "./User.js";
import ShippingDetail from "./ShippingDetail.js";
import CreditCardDetail from "./CreditCardDetail.js";
import Order from "./Order.js";

// User --< ShippingDetail

User.hasMany(ShippingDetail, {
    foreignKey: "UserID",
    as: "shippingDetails",
});

ShippingDetail.belongsTo(User, {
    foreignKey: "UserID",
    as: "user",
});

// User --< CreditCardDetail

User.hasMany(CreditCardDetail, {
    foreignKey: "UserID",
    as: "creditCardDetails",
});

CreditCardDetail.belongsTo(User, {
    foreignKey: "UserID",
    as: "user",
});

// User --< Order

User.hasMany(Order, {
    foreignKey: "UserID",
    as: "orders",
});

Order.belongsTo(User, {
    foreignKey: "UserID",
    as: "user",
});

export { User, ShippingDetail, CreditCardDetail, Order };
