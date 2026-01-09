// routes/routeOrders.ts
import { Router, type Request, type Response } from "express";
import { Transaction } from "sequelize";
import authToken from "../middleware/authToken.js";
import { User, Order, Product, OrderDetail } from "../models/index.js";
import database from "../database.js";

const router = Router();

router.get("/orders", authToken, async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
        console.log("user missing in locals");
        return res.status(500).json({ error: "Server Error" });
    }

    const orders = await Order.findAll({ where: { UserID: user.UserID } });
    return res.status(200).json(orders);
});

interface OrderDetailBody {
    ProductID: number;
    Quantity: number;
}

interface OrderBody {
    OrderDetails: OrderDetailBody[];
}

// Trzeba dodać obsługe płatności za zamówienie
router.post(
    "/orders",
    authToken,
    async (req: Request<{}, {}, OrderBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        const t = await database.transaction();

        try {
            const order = await Order.create(
                {
                    UserID: user.UserID,
                    OrderDate: new Date(),
                    Status: "Planned",
                },
                { transaction: t }
            );

            for (const { ProductID, Quantity } of req.body.OrderDetails) {
                const product = await Product.findByPk(ProductID, {
                    transaction: t,
                    lock: true, // zapobiega Race Condition
                });

                if (!product) {
                    throw new Error(`Product with id ${ProductID} not found`);
                }

                if (product.UnitsInStock < Quantity)
                    throw new Error(
                        `Not enough UnitsInStock of product ${product.Name}`
                    );

                // decrement product's UnitsInStock
                await product.update(
                    {
                        UnitsInStock: product.UnitsInStock - Quantity,
                    },
                    { transaction: t }
                );

                await OrderDetail.create(
                    {
                        ProductID,
                        OrderID: order.OrderID,
                        UnitPrice: product.UnitPrice,
                        Quantity: Quantity,
                        Discount: 0, // hardcoded
                    },
                    { transaction: t }
                );
            }

            await t.commit();
            return res
                .status(201)
                .json({ message: "Successfully created new Order" });
        } catch (error) {
            console.log(error);
            await t.rollback();
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

router.get(
    "/orders/details/:OrderID",
    authToken,
    async (req: Request, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        const order = await Order.findByPk(req.params.OrderID);

        if (!order) {
            console.log("Order not found");
            return res.status(404).json({ error: "Order not found" });
        }

        if (user.UserID !== order.UserID) {
            console.log("Its not your order");
            return res.status(403).json({ error: "Access denied" });
        }

        const orderDetails = await OrderDetail.findAll({
            where: { OrderID: order.OrderID },
        });
        return res.status(200).json(orderDetails);
    }
);

export default router;
