// routes/routesUsers.ts
import { Router, type Request, type Response } from "express";
import authToken from "../middleware/authToken.js";
import { User, ShippingDetail, CreditCardDetail } from "../models/index.js";

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

// CreditCardDetails

interface CreditCardBody {
    LastFourDigits: string;
    Token: string;
    FirstName: string;
    LastName: string;
    CardBrand: string;
    ExpiryMonth: number;
    ExpiryYear: number;
}

router.get(
    "/users/credit-cards",
    authToken,
    async (req: Request, res: Response) => {
        const user = res.locals.user;

        if (!user) {
            console.log("user missing in locals");
            return res.status(500).json({ error: "Server Error" });
        }

        try {
            const cards = await CreditCardDetail.findAll({
                where: { UserID: user.UserID },
            });

            return res.status(200).json(cards);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

router.post(
    "/users/credit-cards",
    authToken,
    async (req: Request<{}, {}, CreditCardBody>, res: Response) => {
        const user = res.locals.user;

        if (!user) return res.status(500).json({ error: "Server Error" });

        try {
            const {
                Token,
                LastFourDigits,
                CardBrand,
                FirstName,
                LastName,
                ExpiryMonth,
                ExpiryYear,
            } = req.body;

            const newCard = await CreditCardDetail.create({
                UserID: user.UserID,
                Token,
                LastFourDigits,
                CardBrand,
                FirstName,
                LastName,
                ExpiryMonth,
                ExpiryYear,
            });

            return res.status(201).json({
                message: "Successfully added credit card",
                data: newCard,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

router.delete(
    "/users/credit-cards/:CreditCardDetailID",
    authToken,
    async (req: Request, res: Response) => {
        const user = res.locals.user;

        if (!user) return res.status(500).json({ error: "Server Error" });

        try {
            const target = await CreditCardDetail.findByPk(
                req.params.CreditCardDetailID
            );

            if (!target) {
                return res.status(404).json({ error: "Credit card not found" });
            }

            if (target.UserID !== user.UserID) {
                return res.status(403).json({ error: "Access denied" });
            }

            await target.destroy();

            return res
                .status(200)
                .json({ message: "Successfully deleted credit card" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Server Error" });
        }
    }
);

export default router;
