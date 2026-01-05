// routes/routesUser.ts
import { Router, type Request, type Response } from "express";

const router = Router();

// Testowy endpoint: GET /api/users
router.get("/users", (req: Request, res: Response) => {
    res.json({ message: "Tutaj będzie lista użytkowników" });
});

export default router;
