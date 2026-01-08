// routes/routesUsers.ts
import { Router, type Request, type Response } from "express";
import authToken from "../middleware/authToken.js";
import { User } from "../models/index.js";

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

export default router;
