// routes/routesUser.ts
import { Router, type Request, type Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = Router();

// Testowy endpoint: GET /api/users
router.get("/users", async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.status(200).json(users);
});

interface RegisterBody {
    email: string;
    password: string;
}

// deafultowo ReqBody w Request jest ustawione na any
router.post(
    "/users/register",
    async (req: Request<{}, {}, RegisterBody>, res: Response) => {
        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({
                where: { Email: email },
            });

            if (existingUser !== null) {
                res.status(400).json({
                    error: "User with this email already exists",
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                Email: email,
                Password: hashedPassword,
            });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: "Failed to register" });
        }
    }
);

export default router;
