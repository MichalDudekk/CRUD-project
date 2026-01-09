// routes/routeOrders.ts
import { Router, type Request, type Response } from "express";
import { Op, type WhereOptions } from "sequelize";
import authToken from "../middleware/authToken.js";
import { User, Order, Product } from "../models/index.js";

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
    Discount: number;
}

interface OrderBody {
    OrderDetails: OrderDetailBody[];
}

router.post(
    "/orders",
    authToken,
    async (req: Request<{}, {}, OrderBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        try {
            // to implement
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

export default router;
