// routes/routesUsers.ts
import { Router, type Request, type Response } from "express";
import authToken from "../middleware/authToken.js";
import { User, ShippingDetail, CreditCardDetail } from "../models/index.js";
import type { Interface } from "node:readline";

const router = Router();

router.get("/users", async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.status(200).json(users);
});

router.get("/users/me", authToken, (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user) {
        console.log("user missing in locals");
        return res.status(500).json({ error: "Server Error" });
    }

    res.status(200).json({
        UserID: user.UserID,
        Email: user.Email,
        IsAdmin: user.IsAdmin,
    });
});

interface RemoveSessionByEmailBody {
    Email: string;
}

router.patch(
    "/users/RemoveSessionByEmail",
    authToken,
    async (req: Request<{}, {}, RemoveSessionByEmailBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        if (!user.IsAdmin) {
            console.log("you need to be admin");
            return res.status(403).json({ error: "Access denied" });
        }

        await User.update(
            { Session: null },
            { where: { Email: req.body.Email } }
        );

        res.status(200).json({
            message: `Succesfully deleted ${req.body.Email} session`,
        });
    }
);

// ShippingDetails

interface ShippingDetailBody {
    ShippingDetailID?: number;
    Country: string;
    City: string;
    Street: string;
    PostalCode: string;
    Phone: string;
    FirstName: string;
    LastName: string;
}

router.post(
    "/users/shipping-details",
    authToken,
    async (req: Request<{}, {}, ShippingDetailBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        try {
            const {
                FirstName,
                LastName,
                Country,
                City,
                Street,
                PostalCode,
                Phone,
            } = req.body;
            await ShippingDetail.create({
                UserID: user.UserID,
                FirstName,
                LastName,
                Country,
                City,
                Street,
                PostalCode,
                Phone,
            });
            return res
                .status(201)
                .json({ message: "Succesfully created ShippingDetail" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

router.get(
    "/users/shipping-details",
    authToken,
    async (req: Request, res: Response) => {
        const user = res.locals.user;

        if (!user) return res.status(500).json({ error: "Server Error" });

        try {
            const result = await ShippingDetail.findAll({
                where: { UserID: user.UserID },
            });
            return res.status(200).json(result);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

router.delete(
    "/users/shipping-details/:ShippingDetailID",
    authToken,
    async (req: Request, res: Response) => {
        const user = res.locals.user;

        if (!user) return res.status(500).json({ error: "Server Error" });

        try {
            const target = await ShippingDetail.findByPk(
                req.params.ShippingDetailID
            );

            if (!target)
                return res
                    .status(404)
                    .json({ error: "Shipping detail not found" });

            if (target?.UserID !== user.UserID)
                return res.status(403).json({ error: "Access denied" });

            await target.destroy();
            return res
                .status(200)
                .json({ message: "Succefully deleted ShippingDetail" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

// DO EDITA
router.patch(
    "/users/shipping-details", // /:id
    authToken,
    async (req: Request<{}, {}, ShippingDetailBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        try {
            const target = await ShippingDetail.findByPk(
                req.body.ShippingDetailID
            );

            if (!target)
                return res
                    .status(404)
                    .json({ error: "Shipping detail not found" });

            if (target?.UserID !== user.UserID)
                return res.status(403).json({ error: "Access denied" });

            const {
                FirstName,
                LastName,
                Country,
                City,
                Street,
                PostalCode,
                Phone,
            } = req.body;

            await target.update({
                FirstName,
                LastName,
                Country,
                City,
                Street,
                PostalCode,
                Phone,
            });

            return res
                .status(200)
                .json({ message: "Succesfully updated ShippingDetail" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

export default router;
