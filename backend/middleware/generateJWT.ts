import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "";

interface RefreshTokenPayload {
    UserID: number;
    Session: string;
}

const generateRefreshToken = (payload: RefreshTokenPayload) => {
    if (SECRET_KEY === "") {
        return;
    }

    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "1h",
        algorithm: "HS256",
    });

    return token;
};

interface AuthTokenPayload {
    UserID: number;
    IsAdmin: boolean;
    Email: string;
}

const generateAuthToken = (payload: AuthTokenPayload) => {
    if (SECRET_KEY === "") {
        return;
    }

    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: "1m",
        algorithm: "HS256",
    });

    return token;
};

export { generateRefreshToken, generateAuthToken };
