// routes/routesAuth.ts
import { Router, type Request, type Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
    generateAuthToken,
    generateRefreshToken,
} from "../middleware/generateJWT.js";
import authToken from "../middleware/authToken.js";

const router = Router();

// Testowy endpoint: GET /api/users
router.get("/users", async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.status(200).json(users);
});

interface LoginOrRegisterBody {
    email: string;
    password: string;
}

// deafultowo ReqBody w Request jest ustawione na any
router.post(
    "/auth/register",
    async (req: Request<{}, {}, LoginOrRegisterBody>, res: Response) => {
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
                IsAdmin: false,
            });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: "Failed to register" });
        }
    }
);

router.post(
    "/auth/login",
    async (req: Request<{}, {}, LoginOrRegisterBody>, res: Response) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({
                where: { Email: email },
            });

            if (user === null) {
                res.status(404).json({
                    error: "User not found",
                });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user.Password);
            if (!passwordMatch) throw new Error("DEV: Invalid password");

            const newSessionUUID = uuidv4();

            const refreshToken = generateRefreshToken({
                UserID: user.UserID,
                Session: newSessionUUID,
            });

            await User.update(
                { Session: newSessionUUID },
                { where: { UserID: user.UserID } }
            );

            res.cookie(`refresh_token`, refreshToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production", // Secure tylko w produkcji
                maxAge: 3600000, // 1 hour
                sameSite: "strict",
                // sameSite: "Lax",
            });

            const authToken = generateAuthToken({
                UserID: user.UserID,
                Email: user.Email,
                IsAdmin: user.IsAdmin,
            });

            res.cookie(`auth_token`, authToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production", // Secure tylko w produkcji
                maxAge: 60000, // 1 hour
                sameSite: "strict",
                // sameSite: "Lax",
            });

            res.status(200).json({ message: "Loged in succesfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to login" });
        }
    }
);

router.get("/test", authToken, async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.status(200).json(users);
});

export default router;
