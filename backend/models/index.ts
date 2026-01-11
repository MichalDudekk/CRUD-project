// model/index.ts
import User from "./User.js";
import ShippingDetail from "./ShippingDetail.js";
import CreditCardDetail from "./CreditCardDetail.js";
import Order from "./Order.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Review from "./Review.js";
import OrderDetail from "./OrderDetail.js";

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

// Categories --< Products

Category.hasMany(Product, { foreignKey: "CategoryID", as: "products" });
Product.belongsTo(Category, { foreignKey: "CategoryID", as: "category" });

// Users --< Reviews

User.hasMany(Review, { foreignKey: "UserID", as: "reviews" });
Review.belongsTo(User, { foreignKey: "UserID", as: "user" });

// Products --< Reviews

Product.hasMany(Review, { foreignKey: "ProductID", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "ProductID", as: "product" });

// Order --< OrderDetail

Order.hasMany(OrderDetail, { foreignKey: "OrderID", as: "orderDetails" });
OrderDetail.belongsTo(Order, { foreignKey: "OrderID", as: "order" });

// Product --< OrderDetail

Product.hasMany(OrderDetail, { foreignKey: "ProductID", as: "orderDetails" });
OrderDetail.belongsTo(Product, { foreignKey: "ProductID", as: "product" });

export {
    User,
    ShippingDetail,
    CreditCardDetail,
    Order,
    Category,
    Product,
    Review,
    OrderDetail,
};
