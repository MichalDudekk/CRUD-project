// routes/routesUser.ts
import { Router, type Request, type Response } from "express";
import User from "../models/User.js";

const router = Router();

// Testowy endpoint: GET /api/users
router.get("/users", async (req: Request, res: Response) => {
    // res.json({ message: "Tutaj będzie lista użytkowników" });
    const users = await User.findAll();
    res.status(200).json(users);
});

export default router;
