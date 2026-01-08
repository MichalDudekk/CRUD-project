// middleware/authToken
import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/index.js";
import { generateAuthToken } from "./generateJWT.js";

const SECRET_KEY = process.env.JWT_SECRET || "";

interface RefreshTokenPayload extends jwt.JwtPayload {
    UserID: number;
    Session: string;
}

const authToken = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies["auth_token"] || null;

    try {
        if (authToken !== null) {
            const decoded = jwt.verify(authToken, SECRET_KEY);
            res.locals.user = decoded;

            console.log("authToken przeszedł");
            next();
            return;
        }
    } catch (error) {
        console.log(error);
        console.log("authToken wygasł");
    }

    // auth_token wygasł lub nigdy nie istniał

    const token = req.cookies["refresh_token"] || null;

    if (!token) {
        return res.status(401).json({ error: "DEV: No refreshToken provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as RefreshTokenPayload;

        const user = await User.findByPk(decoded.UserID);
        if (user === null)
            throw new Error("DEV: user with UserID from token does not exist");

        if (user.Session !== decoded.Session) {
            console.log("DEV: Session params does not match");
            return res.status(403).json({ error: "Access denied" });
        }

        const payload = {
            UserID: user.UserID,
            Email: user.Email,
            IsAdmin: user.IsAdmin,
        };

        const newAuthToken = generateAuthToken(payload);

        res.cookie(`auth_token`, newAuthToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production", // Secure tylko w produkcji
            maxAge: 60000, // 1 min
            sameSite: "strict",
            // sameSite: "Lax",
        });

        res.locals.user = payload;

        // Przekazanie żądania dalej
        next();
        return;
    } catch (error) {
        // Błędy weryfikacji
        console.log(error);
        return res.status(403).json({ error: "Access denied" });
    }
};

export default authToken;
